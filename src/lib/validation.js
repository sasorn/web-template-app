export function validateOption(option) {
  if (option === "") {
    return false;
  }
  return !/^[ \t\n]*$/.test(option);
}

export function validateEmail(fullEmail) {
  if (fullEmail === "") {
    return true;
  }
  return /^([a-z0-9_]([-a-z0-9_.]{0,48}[a-z0-9_])?)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
    fullEmail
  );
}

export function validatePassword(password) {
  if (password === "") {
    return false;
  }
  return /^[ -~]{6,50}$/.test(password);
}

export function validatePasswordsIdentical(
  password = "",
  repeatedPassword = ""
) {
  if (password === "" && repeatedPassword === "") {
    return true;
  }
  if (password !== "" && repeatedPassword === "") {
    return true;
  }
  if (password !== repeatedPassword) {
    return false;
  }
  return true;
}

export function validateText(text) {
  if (text.trim().length < 1) {
    return false;
  }
  return true;
}

export function validateRoom(text) {
  return text !== "";
}

export function validatePhoneCode(phoneCode) {
  return /^(\+?\d{1,3}|\d{1,4})$/.test(phoneCode);
}

export function validatePhoneNumber(phoneNumber) {
  return /[\d]{6,20}/.test(phoneNumber);
}

export function validateCheckbox(value) {
  return value === true;
}

export function validateObject(obj) {
  return Object.keys(obj).length !== 0 && obj.constructor === Object;
}
