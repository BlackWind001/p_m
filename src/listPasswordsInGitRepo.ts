import fsP from 'fs/promises';
import passwordInput from '@inquirer/password';
import { CONFIG_FILE_PATH } from './constants';
import path from 'path';
import decrypt from './decrypt';

/**
 * 1. Check if there is a password directory persisted in the user configuration
 * 2. If not, then display error stating that user can initialize using -i or -s.
 * 3. If yes, then accept a password and get the details of all files in the configured directory.
 * 4. Decrypt files and present the file names/domains to the user.
 */
export default async function listPasswordsInGitRepo () {
  let gitRepoPath;
  try {
    const configFileHandle = await fsP.open(CONFIG_FILE_PATH, 'r');
    const configFileContents = await fsP.readFile(configFileHandle, { encoding: 'utf-8' });
    const config = JSON.parse(configFileContents);
    
    gitRepoPath = config.path;

    if (!gitRepoPath) {
      throw 'Git Directory path not found.'
    }
  }
  catch (err) {
    throw new Error('Error while retrieving the initialized git directory path. If you have not already, please initialize a git directory using either -i or -s options\n' + err);
  }

  try {
    const passwordDirectoryDirents = await fsP.readdir(gitRepoPath, { withFileTypes: true });
    const password = await passwordInput({ message: 'Enter the master password', mask: true });

    if (passwordDirectoryDirents.length === 0) {
      console.log('Password directory is empty');
      return;
    }

    // Remove the git directory from the dirents
    const gitIndex = passwordDirectoryDirents.findIndex((dirent) => { dirent.name === '.git' });
    gitIndex > -1 && (passwordDirectoryDirents.splice(gitIndex, 1));

    // Testing the password against one of the files to ensure that the password is correct.
    const testFileName = passwordDirectoryDirents[0].name;
    const testFileContents = await fsP.readFile(path.join(gitRepoPath, testFileName), { encoding: 'utf-8' });

    JSON.parse(testFileContents);

    // Listing all the files
    passwordDirectoryDirents.forEach((dirent) => {
      console.log(decrypt(dirent.name, password));
    });
  }
  catch (err) {
    throw new Error('Error while decrypting the stored passwords. Check if you have entered the correct password\n' + err);
  }

}