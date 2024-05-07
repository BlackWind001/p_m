import Table from 'cli-table3';
import fsP from 'fs/promises';
import input from '@inquirer/input';
import path from 'path';
import passwordInput from '@inquirer/password';
import _getGitDirectoryPath from "./_getGitDirectoryPath";
import _getGitDirectoryDirents from './_getGitDirectoryDirents';
import _checkMasterPasswordValidity from './_checkMasterPasswordValidity';
import decrypt from './decrypt';
import { DecryptedPasswordType, PasswordDataType, PasswordFileReadFailureType, PasswordFileReadSuccessType } from './types';
import _deletePasswordEntry from './_deletePasswordFile';

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
    const masterPassword = await passwordInput({ message: 'Enter the master password', mask: true });
    const passwordDirectoryDirents = await _getGitDirectoryDirents();

    await _checkMasterPasswordValidity(masterPassword);

    const domain = await input({ message: 'Enter the domain (ex: github.com || ex: My Github password)' });
    const contents = await Promise.allSettled(passwordDirectoryDirents.map((dirent) => {
      const filePath = path.join(gitRepoPath, dirent.name);
      return fsP.readFile(
        filePath, { encoding: 'utf-8', flag: 'r' }
      ).then((data): PasswordFileReadSuccessType => {
        return {
          type: 'success',
          filePath,
          contents: data
        }
      }).catch((err) : PasswordFileReadFailureType => {
        return {
          type: 'failure',
          filePath,
          error: err
        };
      });
    }));

    const decryptedPasswordsData = await Promise.all(
      contents
      .filter((data) => data.status === 'fulfilled' && data.value.type === 'success')
      .map(async (data) : Promise<PasswordDataType | undefined> => {
        // Doing the check for status again because TS is complaining.
        // ToDo: [TechDebt] Check how to remove this additional status check.
        if (data.status === 'rejected' || data.value.type === 'failure') {
          return;
        }

        const decryptedData = await decrypt(data.value.contents, masterPassword);
        return {
          filePath: data.value.filePath,
          ...(JSON.parse(decryptedData) as DecryptedPasswordType)
        };
      }));

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

  }
}
