import fsP from 'fs/promises';

export default async function _deletePasswordFile (passwordFilePath: string) {
  return await fsP.rm(passwordFilePath);
}