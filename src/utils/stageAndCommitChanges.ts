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
    console.log(errorMsg, err);
    throw err;
  }
}
