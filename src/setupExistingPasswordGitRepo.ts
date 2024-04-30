import persistUserConfiguration from "./persistUserConfiguration";
import checkDirValidity from "./utils/checkDirValidity";
import nodePath from "path";

/**
 * 1. Check if the supplied path is a valid directory.
 * 2. Check for the `.git` folder to ensure it is a git repo.
 * 3. If valid git repo, save the directory location in config file.
 * 
 * ToDo: [Testing] Write test for this
 */
export default async function setupExistingPasswordGitRepo (path: string) {
  try {
    // The following line will ideally check for the existence of both the
    // git directory and the presence of the .git folder in the git directory.
    await checkDirValidity(nodePath.join(path, '.git'));

    await persistUserConfiguration({
      path: nodePath.normalize(nodePath.join(__dirname, path))
    });
  }
  catch (err) {
    throw new Error('Error while initializing existing git directory:');
  }
}