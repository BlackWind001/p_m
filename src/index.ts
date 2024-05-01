import input from '@inquirer/input';
import passwordInput from '@inquirer/password';
import encrypt from './encrypt';
import decrypt from './decrypt';
import { program } from 'commander';
import initializeNewPasswordGitRepo from './initializeNewPasswordGitRepo';
import setupTestPassword from './setupTestPassword';
import connectToRemoteOrigin from './connectToRemoteOrigin';
import setupExistingPasswordGitRepo from './setupExistingPasswordGitRepo';
import listPasswordsInGitRepo from './listPasswordsInGitRepo';

async function encryptDecrypt () {
  const toEncrypt = await input({ message: 'Enter a string to encrpyt' });
  const password = await passwordInput({ message: 'Enter password to encrypt the string', mask: true });

  const encryptedText = <string>await encrypt(toEncrypt, password);

  console.log(encryptedText);

  const decryptedText = await decrypt(encryptedText, password);

  console.log(decryptedText);
}

async function main () {

  program
    .command('init <path>')
    .description('initialize a new git password directory')
    .action(async (path) => {
      await initializeNewPasswordGitRepo(path);
      await setupTestPassword(path);
      await connectToRemoteOrigin(path);
    });

  program
    .command('setup <path>')
    .description('initialize an existing git password directory')
    .action(async (path) => {
      await setupExistingPasswordGitRepo(path);
    })
  
  program
    .command('ls')
    .action(listPasswordsInGitRepo);

  program.parse();
}

main();
