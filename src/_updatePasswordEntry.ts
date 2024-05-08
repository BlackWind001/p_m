import fsP from 'fs/promises';
import encrpyt from './encrypt';
import { DecryptedPasswordType, PasswordDataType } from "./types";

export default async function _updatePasswordEntry (
  newPasswordDetails: PasswordDataType,
  oldPasswordDetails: PasswordDataType,
  masterPassword: string
) {
  if (newPasswordDetails.filePath !== oldPasswordDetails.filePath) {
    throw new Error('Error occurred while updating password entry. Please try again.');
  }

  const oldPasswordEntry: DecryptedPasswordType = {
    domain: oldPasswordDetails.domain,
    username: oldPasswordDetails.username,
    password: oldPasswordDetails.password
  };
  const newPasswordEntry: DecryptedPasswordType = {
    domain: newPasswordDetails.domain,
    username: newPasswordDetails.username,
    password: newPasswordDetails.password
  };

  return await fsP.writeFile(
    newPasswordDetails.filePath,
    await encrpyt(JSON.stringify(newPasswordEntry), masterPassword),
    { encoding: 'utf-8' }
  );
}