import simpleGit, { CleanOptions, ResetMode } from "simple-git";

export default async function revertLocalChanges (
  gitDirectoryPath: string,
  {
    errorMsg = 'Error occurred while reverting local changes'
  }
) {
  try {
    const git = simpleGit(gitDirectoryPath, { binary: 'git' });
    await git.reset(ResetMode.HARD);
    await git.clean(CleanOptions.FORCE);
  }
  catch (err) {
    // Not throwing here on purpose.
    // We do not want the user to have bad experience just cause the changes could not be committed.
    // If they want, they can manually go into the password folder and commit the changes.
    console.error(errorMsg, err);
  }
}
