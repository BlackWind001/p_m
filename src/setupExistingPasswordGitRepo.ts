import persistUserConfiguration from "./persistUserConfiguration";
import checkDirValidity from "./utils/checkDirValidity";
import nodePath from "path";

/**
 * 1. Check if the supplied path is a valid directory.
 * 2. Check for the `.git` folder to ensure it is a git repo.
 * 3. If valid git repo, save the directory location in config file.
 * 
 * ToDo: [Testing] Write test for this
 * 
 * Steps to test:
 * 1. Run the init command and setup a directory.
 * 2. Delete the config file that was created.
 * 3. Use the setup command.
 * 4. Check if the file config file is recreated with the path again.
 */
export default async function setupExistingPasswordGitRepo (path: string) {
  try {
    // The following line will ideally check for the existence of both the
    // git directory and the presence of the .git folder in the git directory.
    await checkDirValidity(nodePath.join(path, '.git'));

    await persistUserConfiguration({
      path: nodePath.normalize(nodePath.join(__dirname, path))
    });

    console.log('Setup existing git password directory: ✔');
  }
  catch (err) {
    console.log('Please ensuere the passed directory is a git repo.');
    throw new Error('Error while initializing existing git directory:' + err);
  }
}
