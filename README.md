## p_m

A GIT based password manager.

### What's the idea?

The user maintains a private git repository which will store his encrypted passwords.
The terminal CLI will enable him to easily view these passwords and update them as and when necessary.

### Features

1. AES encryption ✔
2. GIT integration ✔
3. Setup new password directory ✔
4. Setup existing git directory ✔
5. Add a new entry ✔
6. Delete an existing entry ❌
7. Update an existing entry ❌
8. List passwords from git directory ✔
9. Change master password - changes all the encrypted passwords ❌
10. Copy a password to clipboard ❌
11. Connect it to a remote origin ❌
12. Allow user to change the remote origin after initial setup as well ❌

Found a blocker:
- When encrypting the domain to turn it into the filename, the encrypted filename can contain `/` character making it an invalid file name.

Potential solution:
- Use a random alphanumberic string for the filename.
- Add the domain details in the file itself.

### Immediate  ToDos after implementing basic features
1. Create stores for the following:
  - The git directory path (once we validate that the path exists, it should be stored somewhere so it can be used for the entire session)
  - The password file contents once we read them as part of the ls command or any other command (note that this store should react to changes like adding/deleting passwords)
  - Master password (once the user enters their master password, he/she should not have to enter their password again throughout the session)
2. Create an executable out of this application so user does not need to have nodeJS on their system.
  - Check [this](https://medium.com/@shayan.ta69/how-to-build-node-js-application-933e006d7b86) article. It looks promising and will get you experience with Gulp.
  - Check [this](https://dev.to/cloudx/how-to-package-a-node-app-with-their-dependencies-p4g) as well.
  - https://remusao.github.io/posts/packaging-nodejs-apps.html
  - Check the [pkg](https://www.npmjs.com/package/pkg) package
