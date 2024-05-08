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
import addNewPassword from './addNewPassword';
import deleteExistingPassword from './deleteExistingPassword';
import updateExistingPassword from './updateExistingPassword';
import viewPassword from './viewPassword';

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
  });
  
  program
  .command('add')
  .description('add a new password')
  .action(async () => {
    await addNewPassword();
  });

  program
  .command('delete')
  .description('delete an existing password')
  .action(async () => {
    await deleteExistingPassword();
  });

  program
  .command('update')
  .description('update an existing password')
  .action(async () => {
    await updateExistingPassword();
  });

  program
  .command('view [searchString]')
  .description('view specific password')
  .action(async (searchString) => {
    await viewPassword(searchString);
  })
  
  program
  .command('ls')
  .action(async () => {
    await listPasswordsInGitRepo();
  });

  program.parse();
}

main();
