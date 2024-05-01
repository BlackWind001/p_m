import fsP from 'fs/promises';
import path from 'path';
import _getGitDirectoryDirents from "./_getGitDirectoryDirents";
import _getGitDirectoryPath from "./_getGitDirectoryPath";
import decrypt from "./decrypt";

export default async function _checkMasterPasswordValidity (masterPassword: string) {
  const gitDirectoryPath = await _getGitDirectoryPath();
  const passwordDirectoryDirents = await _getGitDirectoryDirents();

  // Testing the password against one of the files to ensure that the password is correct.
  const testFileName = passwordDirectoryDirents[0].name;

  const testFileContents = await fsP.readFile(path.join(gitDirectoryPath, testFileName), { encoding: 'utf-8' });

  JSON.parse(await decrypt(testFileContents, masterPassword));
}
