export function checkPasswordLength(password: string) {
  if (password.length < 6) {
    return false;
  } else {
    return true;
  }
}
