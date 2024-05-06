import fsP from 'fs/promises';
import crypto from 'crypto';
import path from 'path';
import passwordInput from '@inquirer/password';
import encrpyt from './encrypt';
import stageAndCommitChanges from './utils/stageAndCommitChanges';

/**
 * 1. Request user's master password.
 * 2. Encrypt test details with master password.
 * 3. Save the encrypted details to a file
 */
async function setupTestPassword (dirPath: string) {
  let encFileDescriptor = null;
  try {
    const password = await passwordInput({ message: 'Enter master password to complete the setup', mask: true });
    const domain = 'example.com',
      username = 'test',
      testPass = 'test-password';
    const encFileName = crypto.randomUUID();
    const encData = await encrpyt(JSON.stringify({ domain, username, password: testPass }), password);
    const encFilePath = path.join(dirPath, encFileName); // ToDo: Persist encFilePath.
    encFileDescriptor = await fsP.open(encFilePath, 'wx+');

    await fsP.writeFile(encFileDescriptor, encData);

    console.log('Setup test password in new git directory. ✔');
  }
  catch (err) {
    console.log('Error while setting up test password using the master password.', err);
    throw err;
  }
  finally {
    await encFileDescriptor?.close()
  }

  await stageAndCommitChanges(dirPath, {
    commitMsg: 'Initial commit. Added password for domain example.com',
    errorMsg: 'Encountered error while committing test password'
  });
}

export default setupTestPassword;
