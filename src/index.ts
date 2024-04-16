import input from '@inquirer/input';
import encrypt from './encrypt';
import decrypt from './decrypt';

async function main () {
  const toEncrypt = await input({ message: 'Enter a string to encrpyt' });
  const password = await input({ message: 'Enter password to encrypt the string' });

  const encryptedText = <string>await encrypt(toEncrypt, password);

  console.log(encryptedText);

  const decryptedText = await decrypt(encryptedText, password);

  console.log(decryptedText);
}

main();
