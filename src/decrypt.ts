// ToDo: Replace CryptoJS with either crypto module
// or custom implementation of AES-128
import CryptoJS from 'crypto-js';
function decrypt (encryptedString: string, password: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedString, password);

  return bytes.toString(CryptoJS.enc.Utf8);
}

export default decrypt;
