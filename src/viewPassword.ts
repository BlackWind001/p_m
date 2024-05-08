import Table from 'cli-table3';
import input from '@inquirer/input';
import _acceptMasterPassword from "./helpers/_acceptMasterPassword";
import _getGitDirectoryPath from "./helpers/_getGitDirectoryPath";
import _getAllPasswordData from './helpers/_getAllPasswordData';
import { PasswordDataType } from './types';

export default async function viewPassword (searchString = '') {
  let gitRepoPath;
  try {
    gitRepoPath = await _getGitDirectoryPath();
  }
  catch (err) {
    throw new Error('Error while retrieving the initialized git directory path. If you have not already, please initialize a git directory using either p_m init or p_m setup\n' + err);
  }
  try {
    const masterPassword = await _acceptMasterPassword();
    const passwordTable = new Table({ head: ['Domain', 'Username', 'Password'] });

    if (searchString === '') {
      searchString = await input({ message: 'Enter the domain or username associated with the password' });
    }

    const decryptedPasswordsData = await _getAllPasswordData(masterPassword);

    const matchedEntries = decryptedPasswordsData.filter((data) => {
      return data && (data.domain.indexOf(searchString) > -1 || data.username.indexOf(searchString) > -1);
    });

    if (matchedEntries.length === 0) {
      console.log('No domain entry matches the given string');
      return;
    }
    else if (matchedEntries.length === 1) {
      
      const entry = <PasswordDataType>matchedEntries[0];
      passwordTable.push([
        entry.domain, entry.username, entry.password
      ]);
      console.log(passwordTable.toString());
      return;
    }
    else {
      const multiEntryTable = new Table({ head: ['Index', 'Domain', 'Username'] });
      matchedEntries.forEach((entry, index) => {
        multiEntryTable.push([index, entry.domain, entry.username]);
      });
      console.log(multiEntryTable.toString());

      const selectedIndex = Number.parseInt(await input({ message: 'Enter the index of the password to view' }));
      if (Number.isNaN(selectedIndex) || selectedIndex >= matchedEntries.length) {
        console.error('Number entered was not valid');
        return;
      }
      const selectedEntry = <PasswordDataType>matchedEntries[selectedIndex];
      passwordTable.push([selectedEntry.domain, selectedEntry.username, selectedEntry.password]);
      console.log(passwordTable.toString());
    }

  }
  catch (err) {
    throw new Error('Error while retreiving the password ' + err);
  }
}
