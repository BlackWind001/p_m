import fsP from 'fs/promises';
import passwordInput from '@inquirer/password';
import path from 'path';
import Table from 'cli-table3';
import decrypt from './decrypt';
import _getGitDirectoryPath from './_getGitDirectoryPath';
import _getGitDirectoryDirents from './_getGitDirectoryDirents';
import _checkMasterPasswordValidity from './_checkMasterPasswordValidity';
import _getAllPasswordData from './_getAllPasswordData';
import _acceptMasterPassword from './_acceptMasterPassword';

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
    const password = await _acceptMasterPassword();
    const allPasswordData = await _getAllPasswordData(password);
    const table = new Table({ head: ['Domain', 'Username'] });

    await _checkMasterPasswordValidity(password);

    allPasswordData
    .sort((entryA, entryB) => {
      return entryA.domain.localeCompare(entryB.domain);
    })
    .forEach((passwordDataEntry) => {
      table.push([passwordDataEntry.domain, passwordDataEntry.username]);
    });

    console.log(table.toString());
  }
  catch (err) {
    throw new Error('Error while decrypting the stored passwords. Check if you have entered the correct password\n' + err);
  }

}