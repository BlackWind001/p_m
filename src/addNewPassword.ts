import crypto from 'crypto';
import fsP from 'fs/promises';
import path from 'path';
import input from '@inquirer/input';
import passwordInput from '@inquirer/password';
import _checkMasterPasswordValidity from './_checkMasterPasswordValidity';
import encrpyt from './encrypt';
import _getGitDirectoryPath from './_getGitDirectoryPath';
import stageAndCommitChanges from './utils/stageAndCommitChanges';

export default async function addNewPassword () {
  const masterPassword = await passwordInput({ message: 'Enter master password', mask: true });
  let gitDirectoryPath, domain;

  await _checkMasterPasswordValidity(masterPassword);

  try {
    domain = await input({ message: 'Enter the domain for the password (ex: github.com || ex: My Github password)' });
    const username = await input({ message: 'Enter a username/id associated with the domain' });
    const password = await passwordInput({ message: 'Enter password for the above domain and username', mask: true });
    const encFileName = crypto.randomUUID();
    const encData = await encrpyt(JSON.stringify({ domain, username, password }), masterPassword);
    gitDirectoryPath = await _getGitDirectoryPath();
    const encFilePath = path.join(gitDirectoryPath, encFileName);

    fsP.writeFile(encFilePath, encData, { encoding: 'utf-8', flag: 'wx+' });

    console.log('Added new password for domain', domain,'under username', username);
  }
  catch (err) {
    console.log('Encountered error while adding new password to the saved passwords', err);
    throw err;
  }

  await stageAndCommitChanges(gitDirectoryPath, {
    commitMsg: `Added password for domain ${domain}`,
    errorMsg: 'Encountered error while committing the newly added password.'
  });
}
