import passwordInput from '@inquirer/password';
import _acceptMasterPassword from "./_acceptMasterPassword";
import _checkMasterPasswordValidity from "./_checkMasterPasswordValidity";
import _getGitDirectoryPath from "./_getGitDirectoryPath";
import _getAllPasswordData from './_getAllPasswordData';
import _updatePasswordEntry from './_updatePasswordEntry';
import stageAndCommitChanges from './utils/stageAndCommitChanges';
import revertLocalChanges from './utils/revertLocalChanges';

export default async function updateMasterPassword () {
  let gitRepoPath;
  try {
    gitRepoPath = await _getGitDirectoryPath();
  }
  catch (err) {
    throw new Error('Error while retrieving the initialized git directory path. If you have not already, please initialize a git directory using either p_m init or p_m setup\n' + err);
  }

  try {
    const masterPassword = await _acceptMasterPassword();

    await _checkMasterPasswordValidity(masterPassword);

    const updatedMasterPassword = await passwordInput({ message: 'Enter the new master password', mask: true });
    const decryptedPasswordsData = await _getAllPasswordData(masterPassword);

    const updatePromises = decryptedPasswordsData.map((passwordData) => {
      return _updatePasswordEntry(passwordData, passwordData, updatedMasterPassword);
    });

    const promiseStatuses = await Promise.allSettled(updatePromises);
    const didUpdateFail = (promiseStatuses.findIndex((prom) => prom.status === 'rejected')) > -1;

    if (didUpdateFail) {
      console.log('❌ Error occurred while updating password files. Reverting changes....');
      await revertLocalChanges(gitRepoPath, {});
      return;
    }

    await stageAndCommitChanges(gitRepoPath, {
      commitMsg: 'Updated master password.',
      errorMsg: '❌ Encountered error while committing the changes for the updated master password.'
    });

    console.log('✔ Updated master password');
  }
  catch (err) {
    throw new Error('Error while updating master password' + err);
  }
}
