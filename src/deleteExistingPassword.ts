import Table from 'cli-table3';
import input from '@inquirer/input';
import _getGitDirectoryPath from "./_getGitDirectoryPath";
import _getGitDirectoryDirents from './_getGitDirectoryDirents';
import _checkMasterPasswordValidity from './_checkMasterPasswordValidity';
import { PasswordDataType } from './types';
import _deletePasswordEntry from './_deletePasswordFile';
import _getAllPasswordData from './_getAllPasswordData';
import _acceptMasterPassword from './_acceptMasterPassword';
import stageAndCommitChanges from './utils/stageAndCommitChanges';

/**
 * ToDo: [Readability] Restructure and clean-up this function to be more readable.
 */
export default async function deleteExistingPassword () {
  let gitRepoPath;
  try {
    gitRepoPath = await _getGitDirectoryPath();
  }
  catch (err) {
    throw new Error('Error while retrieving the initialized git directory path. If you have not already, please initialize a git directory using either p_m init or p_m setup\n' + err);
  }

  try {
    const masterPassword = await _acceptMasterPassword();

    await _checkMasterPasswordValidity(masterPassword);

    const searchString = await input({ message: 'Enter the domain or username associated with the password' });
    const decryptedPasswordsData = await _getAllPasswordData(masterPassword);

    const matchedPasswords = decryptedPasswordsData.filter((data) => {
      return data && (data.domain.indexOf(searchString) > -1 || data.username.indexOf(searchString) > -1);
    });

    if (matchedPasswords.length === 0) {
      console.log('No domain entry matches the given string');
      return;
    }
    else if (matchedPasswords.length === 1) {
      const entry = <PasswordDataType>matchedPasswords[0];
      await _deletePasswordEntry(entry.filePath);
      console.log(`Deleted password for domain ${entry.domain} ✔`);
    }
    else {
      const table = new Table({ head: ['Index', 'Domain', 'Username'] });
      matchedPasswords.forEach((match, index) => {
        if (!match) {
          return;
        }
        table.push([index, match.domain, match.username]);
      });
      console.log(table.toString());
      const selectedIndex = Number.parseInt(await input({ message: 'Enter the index of the password to delete' }));

      if (Number.isNaN(selectedIndex) || selectedIndex >= matchedPasswords.length) {
        console.error('Number entered was not valid');
        return;
      }
      const entry = <PasswordDataType>matchedPasswords[selectedIndex];
      await _deletePasswordEntry(entry.filePath);
      console.log(`Deleted password for domain ${entry.domain} ✔`);

      await stageAndCommitChanges(gitRepoPath, {
        commitMsg: `Deleted password for domain ${entry.domain}`,
        errorMsg: 'Encountered error while committing the newly deleted password. ❌'
      });
    }
  }
  catch (err) {
    throw new Error('Error while deleting password entry '+ err);
  }
}
