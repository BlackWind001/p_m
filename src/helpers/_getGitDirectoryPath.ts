import fsP from 'fs/promises'
import { CONFIG_FILE_PATH } from '../constants';

export default async function _getGitDirectoryPath () {
  const configFileHandle = await fsP.open(CONFIG_FILE_PATH, 'r');
  const configFileContents = await fsP.readFile(configFileHandle, { encoding: 'utf-8' });
  const config = JSON.parse(configFileContents);
  
  const gitRepoPath = config.path;

  if (!gitRepoPath) {
    throw 'Git Directory path not found.'
  }

  await configFileHandle.close();

  return gitRepoPath;
}
