import fsP from 'fs/promises';
import passwordInput from '@inquirer/password';
import path from 'path';
import Table from 'cli-table3';
import decrypt from './decrypt';
import _getGitDirectoryPath from './_getGitDirectoryPath';
import _getGitDirectoryDirents from './_getGitDirectoryDirents';
import _checkMasterPasswordValidity from './_checkMasterPasswordValidity';

/**
 * 1. Check if there is a password directory persisted in the user configuration
 * 2. If not, then display error stating that user can initialize using -i or -s.
 * 3. If yes, then accept a password and get the details of all files in the configured directory.
 * 4. Decrypt files and present the file names/domains to the user.
 */
export default async function listPasswordsInGitRepo () {
  let gitRepoPath;
  try {
    gitRepoPath = await _getGitDirectoryPath();
  }
  catch (err) {
    throw new Error('Error while retrieving the initialized git directory path. If you have not already, please initialize a git directory using either p_m init or p_m setup\n' + err);
  }

  try {
    const password = await passwordInput({ message: 'Enter the master password', mask: true });
    const passwordDirectoryDirents = await _getGitDirectoryDirents();
    const table = new Table({ head: ['Domain', 'Username'] });
    let encounteredErrorWhileOpeningFiles = false;

    await _checkMasterPasswordValidity(password);

    const contents = await Promise.allSettled(passwordDirectoryDirents.map((dirent) => {
      return fsP.readFile(path.join(gitRepoPath, dirent.name), { encoding: 'utf-8', flag: 'r' });
    }));
    
    const promises = contents.map(async (data) => {
      if (data.status === 'rejected' && !encounteredErrorWhileOpeningFiles) {
        console.log('Encountered error(s) while opening password files. Resuming the rest of the ls operation.');
        encounteredErrorWhileOpeningFiles = true;
        return;
      }

      if (data.status === 'fulfilled') {
        const decryptedData = await decrypt(data.value, password);
        const parsedData = JSON.parse(decryptedData);
        table.push([parsedData.domain, parsedData.username]);
      }
    });

    await Promise.allSettled(promises);
    console.log(table.toString());
  }
  catch (err) {
    throw new Error('Error while decrypting the stored passwords. Check if you have entered the correct password\n' + err);
  }

}