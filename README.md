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
5. Add a new entry ❌
6. List passwords from git directory ✔
7. Change master password - changes all the encrypted passwords ❌
8. Copy a password to clipboard ❌
9. Connect it to a remote origin ❌

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
