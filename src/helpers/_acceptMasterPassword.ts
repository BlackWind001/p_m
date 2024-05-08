import passwordInput from '@inquirer/password';

export default async function _acceptMasterPassword () {
  return await passwordInput({ message: 'Enter the master password', mask: true });
}