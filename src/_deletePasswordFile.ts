import fsP from 'fs/promises';
import { PasswordDataType } from "./types";

export default async function _deletePasswordFile (passwordFilePath: string) {
  return await fsP.rm(passwordFilePath);
}