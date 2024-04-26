import fsP from 'fs/promises';
import path from 'path';
import passwordInput from '@inquirer/password';
import encrpyt from './encrypt';

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
    const encFileName = await encrpyt(domain, password);
    const encData = await encrpyt(JSON.stringify({ username, password: testPass }), password);
    const encFilePath = path.join(dirPath, encFileName); // ToDo: Persist encFilePath.
    encFileDescriptor = await fsP.open(encFilePath, 'wx');

    await fsP.writeFile(encFileDescriptor, encData);

    console.log('Setup test password in new git directory. ✔');
  }
  finally {
    await encFileDescriptor?.close()
  }
}

export default setupTestPassword;
