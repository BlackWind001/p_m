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
6. Delete an existing entry ✔
7. Update an existing entry ✔
8. List passwords from git directory ✔
9. Change master password - changes all the encrypted passwords ❌
10. View selected password ✔
11. Copy a password to clipboard ❌
12. Connect it to a remote origin ❌
13. Allow user to change the remote origin after initial setup as well ❌

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
3. When displaying domains and usernames, sort according to domains.
4. Add a confirmation step in delete flow when the user enters the exact domain.
5. Allow user to enter domain and username details as argument(s) while executing the command similar to how we allow search string to be passed for view flow.
6. Handle errors with meaningful error messages instead of throwing the errors directly (floods the user's screen with unnecessary data).
7. Handle Ctrl+c interrupt better. Check [this](https://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js) for reference.
8. Update interface so the user can continuously use the program without having to type the master password for every command. For example, when the user types `p_m` without any arguments, we take the user into an interactive mode that allows the user to input commands like `ls`, `add`, `help` etc. In this flow, the user only has to enter the master password once and then not worry about entering the master password again.
9. Abstract out the flow where we filter the password list based on a search string. I am repeating the same logic in delete, update and view flows.
