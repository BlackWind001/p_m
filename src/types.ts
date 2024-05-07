export type DecryptedPasswordType = {
  domain: string;
  username: string;
  password: string;
};

export type PasswordFileReadSuccessType = {
  type: 'success';
  filePath: string;
  contents: string;
};

export type PasswordFileReadFailureType = {
  type: 'failure';
  filePath: string;
  error: any;
};

export type PasswordDataType = DecryptedPasswordType & {
  filePath: string;
};
