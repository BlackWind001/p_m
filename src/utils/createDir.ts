import fsP from 'fs/promises';

export default async function createDir (path: string) {
  try {
    await fsP.mkdir(path, { recursive: true });
    console.log('Directory created successfully. ✔️');
  }
  catch (err) {
    console.error('Directory creation failed. ❌');
    throw new Error(`Error while creating directory ${path}` + err);
  }
}
