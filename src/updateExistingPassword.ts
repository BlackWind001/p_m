import Table from 'cli-table3';
import input from '@inquirer/input';
import passwordInput from '@inquirer/password';
import _acceptMasterPassword from './helpers/_acceptMasterPassword';
import _getGitDirectoryPath from './helpers/_getGitDirectoryPath';
import _getAllPasswordData from './helpers/_getAllPasswordData';
import { PasswordDataType } from './types';
import _updatePasswordEntry from './helpers/_updatePasswordEntry';
import stageAndCommitChanges from './utils/stageAndCommitChanges';

export default async function updateExistingPassword () {
  let gitRepoPath;
  try {
    gitRepoPath = await _getGitDirectoryPath();
  }
  catch (err) {
    throw new Error('Error while retrieving the initialized git directory path. If you have not already, please initialize a git directory using either p_m init or p_m setup\n' + err);
  }

  try {
    const masterPassword = await _acceptMasterPassword();
    const searchString = await input({ message: 'Enter the domain or username associated with the password' });
    const decryptedPasswordsData = await _getAllPasswordData(masterPassword);
    const table = new Table({ head: ['Index', 'Domain', 'Username'] });

    const matchedPasswords = decryptedPasswordsData.filter((data) => {
      return data && (data.domain.indexOf(searchString) > -1 || data.username.indexOf(searchString) > -1);
    });

    if (matchedPasswords.length === 0) {
      console.log('No domain entry matches the given string');
      return;
    }
    else {
      let selectedIndex = 0;
      if (matchedPasswords.length > 1) {
        matchedPasswords.forEach((match, index) => {
          if (!match) {
            return;
          }
          table.push([index, match.domain, match.username]);
        });
        console.log(table.toString());
        selectedIndex = Number.parseInt(await input({ message: 'Enter the index of the password to update' }));

        if (Number.isNaN(selectedIndex) || selectedIndex >= matchedPasswords.length) {
          console.error('Index entered was not valid');
          return;
        }
      }

      const entry = <PasswordDataType>matchedPasswords[selectedIndex];

      const updatedUsername = (
        await input({
          message: `Enter new username for domain "${entry.domain}". (Hit enter to keep the value unchanged)`
        })
      ) || entry.username;
      const updatedPassword = (
        await passwordInput({
          message: `Enter new password for domain "${entry.domain}" with username "${entry.username}. (Hit enter to keep the value unchanged)"`, mask: true
        })
      ) || entry.password;
      const newPasswordEntry: PasswordDataType = {
        filePath: entry.filePath,
        domain: entry.domain,
        username: updatedUsername,
        password: updatedPassword
      };

      const isEntryUnchanged = Object.keys(newPasswordEntry).reduce((acc, key) => {
        // @ts-ignore
        return acc && (newPasswordEntry[key] === entry[key]);
      }, true);

      if (isEntryUnchanged) {
        console.error(`Password for domain ${entry.domain} not updated - nothing to update ❌`);
        return ;
      }

      await _updatePasswordEntry(newPasswordEntry, entry, masterPassword);
      console.log(`Updated password for domain ${entry.domain} ✔`); 

      await stageAndCommitChanges(gitRepoPath, {
        commitMsg: `Updated password for domain ${entry.domain}`,
        errorMsg: 'Encountered error while committing the newly updated password. ❌'
      });
    }
  }
  catch (err) {
    throw new Error('Error while updating password entry '+ err);
  }
}