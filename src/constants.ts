import process from 'process';
import os from 'os';
import path from 'path';

export const CONFIG_FILE_NAME = '.config';

const POSIX_PATH = <string>process.env.HOME;
const WINDOWS_PATH = <string>process.env.LOCALAPPDATA;
const BASE_PLATFORM_SPECIFC_PATH = os.platform() === 'win32' ?
  WINDOWS_PATH :
  POSIX_PATH;
export const CONFIG_DIR_PATH = path.join(BASE_PLATFORM_SPECIFC_PATH, 'p_m'); 
export const CONFIG_FILE_PATH = path.join(
  CONFIG_DIR_PATH,
  CONFIG_FILE_NAME
);