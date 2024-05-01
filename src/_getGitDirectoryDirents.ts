import fsP from 'fs/promises';
import _getGitDirectoryPath from "./_getGitDirectoryPath";

export default async function _getGitDirectoryDirents (showEmptyPasswordDirectoryMsg = true) {
  const gitDirectoryPath = await _getGitDirectoryPath();
  const passwordDirectoryDirents = await fsP.readdir(gitDirectoryPath, { withFileTypes: true });

  // Remove the git directory from the dirents
  const gitIndex = passwordDirectoryDirents.findIndex((dirent) => { return dirent.name === '.git' });
  gitIndex > -1 && (passwordDirectoryDirents.splice(gitIndex, 1));

  if (passwordDirectoryDirents.length === 0 && showEmptyPasswordDirectoryMsg) {
    console.log('Password directory is empty');
  }

  return passwordDirectoryDirents;
}
