import fsP from 'fs/promises';
import { CONFIG_FILE_PATH, CONFIG_DIR_PATH } from './constants';

type configType = {
  path: string
}

async function persistUserConfiguration (config: configType) {
  let fileHandle;
  try {

    try {
      const stat = await fsP.stat(CONFIG_DIR_PATH);

      if (!stat.isDirectory()) {
        throw 'Not a directory';
      }
    }
    catch (err) {
      await fsP.mkdir(CONFIG_DIR_PATH);
    }

    fileHandle = await fsP.open(CONFIG_FILE_PATH, fsP.constants.O_RDWR | fsP.constants.O_CREAT);
    const existingFileContents = await fsP.readFile(fileHandle, { encoding: 'utf-8' });
    const existingFileData = existingFileContents.length > 0 ? JSON.parse(existingFileContents) : {};
    const newFileData = { ...existingFileData, ...config };
    const newFileContents = JSON.stringify(newFileData);

    await fileHandle.write(newFileContents, 0, 'utf-8');
  }
  catch (err) {
    throw new Error('Error while persisting details' + err);
  }
  finally {
    fileHandle && await fileHandle.close();
  }
}

export default persistUserConfiguration;
