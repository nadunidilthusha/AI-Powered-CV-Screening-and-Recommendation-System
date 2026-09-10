// TODO: implement validation helpers for auth forms and file validation
export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const isValidPassword = (password) => password.length >= 8;

export const isAllowedFileType = (file, allowedTypes = ['application/pdf']) =>
  allowedTypes.includes(file.type);
