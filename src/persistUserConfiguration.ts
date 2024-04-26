import fsP from 'fs/promises';
import { CONFIG_FILE_PATH } from './constants';

type configType = {
  path: string
}

async function persistUserConfiguration (config: configType) {
  let fileHandle;
  try {
    fileHandle = await fsP.open(CONFIG_FILE_PATH, fsP.constants.O_RDWR | fsP.constants.O_CREAT);
    const existingFileContents = await fsP.readFile(fileHandle, { encoding: 'utf-8' });
    const existingFileData = existingFileContents.length > 0 ? JSON.parse(existingFileContents) : {};
    const newFileData = { ...existingFileData, ...config };
    const newFileContents = JSON.stringify(newFileData);

    await fileHandle.write(newFileContents, 0, 'utf-8');
  }
  finally {
    fileHandle && await fileHandle.close();
  }
}

export default persistUserConfiguration;
