import fsP from 'fs/promises';

export default async function checkDirValidity (path: string) {
  try {
    await fsP.access(
      path,
      fsP.constants.R_OK | fsP.constants.W_OK
    );

    const stats = await fsP.stat(path);

    if (!stats.isDirectory()) {
      throw new Error(`${path} is not a directory`);
    }
  }
  catch (err: any) {
    throw err;
  }
}