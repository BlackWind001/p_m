import simpleGit from "simple-git";

export default async function stageAndCommitChanges (
  gitDirectoryPath: string,
  {
    commitMsg = 'Made changes',
    errorMsg = 'Error occurred while committing and staging changes'
  }
) {
  try {
    const git = simpleGit(gitDirectoryPath, { binary: 'git' });
    await git.add('.');
    await git.commit(commitMsg);
  }
  catch (err) {
    // Not throwing here on purpose.
    // We do not want the user to have bad experience just cause the changes could not be committed.
    // If they want, they can manually go into the password folder and commit the changes.
    console.error(errorMsg, err);
  }
}
