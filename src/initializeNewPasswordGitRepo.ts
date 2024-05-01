import nodePath from 'path';
import simpleGit from 'simple-git';
import persistUserConfiguration from './persistUserConfiguration';
import checkDirValidity from './utils/checkDirValidity';
import createDir from './utils/createDir';


/**
 * 1. Check if the supplied path is a directory.
 * 2. Use `git init` in that directory.
 * 3. Save the directory's location in a config file for later access.
 * 
 * ToDo: [Testing] Write test for this.
 * ToDo: [Safeguard] If the directory is not empty or is a git repository, throw error and fail.
 */
async function initializeNewPasswordGitRepo (path: string) {

  try {
    await checkDirValidity(path);
  }
  catch (err: any) {
    if (err?.code === 'ENOENT') {
      console.error(`Directory ${path} not found. ❌`);
      console.log(`Creating directory ${path}`);

      await createDir(path);
    }
    else {
      throw new Error('Error while accessing the supplied path ' +  path +':\n' + err);
    }
  }

  // ToDo: [Documentation] Add `git` as a prerequisite in the README.md
  const git = simpleGit(path, { binary: 'git' })

  await git.init();
  console.log('Initialize Git repo. ✔');

  // ToDo: [Safeguard] Persist user configuration only at the end of the init process.
  await persistUserConfiguration({
    path: nodePath.normalize(nodePath.resolve(path))
  });
}

export default initializeNewPasswordGitRepo;
