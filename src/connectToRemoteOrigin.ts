import input from '@inquirer/input'
import simpleGit from 'simple-git';

/**
 * 1. Detect if user is logged in and able to push to the remote.
 * 2. If not logged in, allow the user to log in.
 * 3. Add the remote origin to the local repo.
 */
async function connectToRemoteOrigin(path: string) {
  const url = await input({
    message: 'Enter the remote origin URL for your GIT passwords directory.\n Hit enter if you do not want to connect to a remote origin',
    default: '',
    validate: (remoteOriginURL) => {
      if (remoteOriginURL === '') {
        return true;
      }
      try {
        new URL(remoteOriginURL);
        return true;
      }
      catch (err) {
        console.error('The origin', remoteOriginURL, 'is not a valid URL');
        return false;
      }
    }
  });

  const git = simpleGit(path, { binary: 'git' });

  await git.addRemote('origin', url);
  
}

export default connectToRemoteOrigin;
