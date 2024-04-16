// ToDo: Replace CryptoJS with either crypto module
// or custom implementation of AES-128
import CryptoJS from 'crypto-js';

async function encrpyt (str: string, password: string) {
  return CryptoJS.AES.encrypt(str, password).toString();
}

export default encrpyt;