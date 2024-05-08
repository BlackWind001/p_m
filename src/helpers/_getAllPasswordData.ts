import fsP from 'fs/promises';
import path from "path";
import _checkMasterPasswordValidity from "./_checkMasterPasswordValidity";
import _getGitDirectoryDirents from "./_getGitDirectoryDirents";
import _getGitDirectoryPath from "./_getGitDirectoryPath";
import { DecryptedPasswordType, PasswordDataType, PasswordFileReadFailureType, PasswordFileReadSuccessType } from '../types';
import decrypt from '../decrypt';

export default async function _getAllPasswordData (masterPassword: string): Promise<PasswordDataType[]> {
  let gitRepoPath, passwordDirectoryDirents;
  try {
    gitRepoPath = await _getGitDirectoryPath();
  }
  catch (err) {
    throw new Error('Error while retrieving the initialized git directory path. If you have not already, please initialize a git directory using either p_m init or p_m setup\n' + err);
  }
  
  try {
    passwordDirectoryDirents = await _getGitDirectoryDirents();
  }
  catch (err) {
    throw new Error('Error while getting password directory contents' + err);
  }

  try {
    await _checkMasterPasswordValidity(masterPassword);
  }
  catch (err) {
    throw new Error('Error while validating master password ' + err);
  }

  const passwordFilesReadResults = await Promise.allSettled(passwordDirectoryDirents.map((dirent) => {
    const filePath = path.join(gitRepoPath, dirent.name);

    return fsP.readFile( filePath, { encoding: 'utf-8', flag: 'r' } )
      .then((data): PasswordFileReadSuccessType => {
        return {
          type: 'success',
          filePath,
          contents: data
        }
      })
      .catch((err): PasswordFileReadFailureType => {
        return {
          type: 'failure',
          filePath,
          error: err
        };
      });
  }));

  const encryptedPasswordData = (passwordFilesReadResults
    .filter((data) => data.status === 'fulfilled')
    .map((data) => {
      // Doing the check for status again because TS is complaining.
      // ToDo: [TechDebt] Check how to remove this additional status check.
      if (data.status === 'rejected' || data.value.type === 'failure') {
        return;
      }

      return data.value;
    })
  ) as PasswordFileReadSuccessType[];

  const decryptedPasswordsData = await Promise.all(encryptedPasswordData.map(async (data) => {
    const decryptedData = await decrypt(data.contents, masterPassword);
    return {
      filePath: data.filePath,
      ...(JSON.parse(decryptedData) as DecryptedPasswordType)
    }
  })) as PasswordDataType[];

  return decryptedPasswordsData;
}
