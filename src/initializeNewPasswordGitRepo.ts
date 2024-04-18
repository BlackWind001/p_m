import fsP from 'fs/promises';
import simpleGit from 'simple-git';

async function checkDirValidity (path: string) {
  try {
    await fsP.access(
      path,
      fsP.constants.R_OK | fsP.constants.W_OK
    );

    const stats = await fsP.stat(path);

    if (!stats.isDirectory()) {
      throw new Error(`${path} is not a directory`);
    }
  }
  catch (err) {
    throw new Error('Error while accessing the supplied path ' +  path +':\n' + err);
  }
}

/**
 * 1. Check if the supplied path is a directory.
 * 2. Use `git init` in that directory.
 * 3. Save the directory's location in a config file for later access.
 * 4. Write test for this.
 * 
 * ToDo: [UX] Initialize an empty directory even if the directory is not present.
 * ToDo: [Safeguard] Check if the directory is already a GIT repo. If yes, display a warning to the user.
 */
async function initializeNewPasswordGitRepo (path: string) {
  await checkDirValidity(path);

  // ToDo: Add `git` as a prerequisite in the README.md
  const git = simpleGit(path, { binary: 'git' })

  await git.init();

  console.log('Initialize Git repo. ✔');

  return Promise.resolve();
}

export default initializeNewPasswordGitRepo;
