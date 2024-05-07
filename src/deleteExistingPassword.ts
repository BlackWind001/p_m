import Table from 'cli-table3';
import input from '@inquirer/input';
import passwordInput from '@inquirer/password';
import _getGitDirectoryPath from "./_getGitDirectoryPath";
import _getGitDirectoryDirents from './_getGitDirectoryDirents';
import _checkMasterPasswordValidity from './_checkMasterPasswordValidity';
import { PasswordDataType } from './types';
import _deletePasswordEntry from './_deletePasswordFile';
import _getAllPasswordData from './_getAllPasswordData';
import _acceptMasterPassword from './_acceptMasterPassword';

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
    const domain = await input({ message: 'Enter the domain (ex: github.com || ex: My Github password)' });
    const decryptedPasswordsData = await _getAllPasswordData(masterPassword);

    const matchedPasswords = decryptedPasswordsData.filter((data) => {
      return data && data.domain.indexOf(domain) > -1;
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
        table.push([index, match.domain, match.password]);
      });
      console.log(table.toString());
      const selection = Number.parseInt(await input({ message: 'Enter the index of the password to delete' }));

      if (Number.isNaN(selection)) {
        console.error('Number entered was not valid');
        return;
      }
      const entry = <PasswordDataType>matchedPasswords[selection];
      await _deletePasswordEntry(entry.filePath);
      console.log(`Deleted password for domain ${entry.domain} ✔`);
    }
  }
  catch (err) {
    throw new Error('Error while deleting password entry '+ err);
  }
}
