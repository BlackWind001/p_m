import input from '@inquirer/input';
import encrypt from './encrypt';

async function main () {
  const answer = await input({ message: 'Enter a string to encrpyt' });

  console.log(encrypt(answer));
}

main();
