import input from '@inquirer/input';
import passwordInput from '@inquirer/password';
import encrypt from './encrypt';
import decrypt from './decrypt';
import { program } from 'commander';
import initializeNewPasswordGitRepo from './initializeNewPasswordGitRepo';
import setupTestPassword from './setupTestPassword';
import connectToRemoteOrigin from './connectToRemoteOrigin';

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
    .option('-i, --init <path>', 'initialize a new git password directory')
    .option('-s, --setup <path>', 'initialize an existing git password directory');

  program.parse();

  const options = program.opts();

  if (options.init) {
    const path = options.init;

    await initializeNewPasswordGitRepo(path);
    await setupTestPassword(path);
    await connectToRemoteOrigin(path);
  }

  if (options.init && options.setup) {
    throw 'Cannot use -i and -s at the same time. Either initialize a new git password directory or setup an existing one';
  }

  if (options.setup) {
    const path = options.setup;
  }
}

main();
