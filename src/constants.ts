import process from 'process';
import os from 'os';
import path from 'path';

export const CONFIG_FILE_NAME = 'configuration.json';

const POSIX_PATH = process.env.HOME || '~';
const WINDOWS_PATH = process.env.LOCALAPPDATA || '';
const PLATFORM_SPECIFIC_PATH = os.platform() === 'win32' ?
  WINDOWS_PATH :
  POSIX_PATH;
export const CONFIG_FILE_PATH = path.join(
  PLATFORM_SPECIFIC_PATH,
  CONFIG_FILE_NAME
);