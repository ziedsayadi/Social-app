const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function (data) {
  let errors = {};

  data.hundel = !isEmpty(data.hundel) ? data.hundel : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email feild is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is not valid";
  }
  if (Validator.isEmpty(data.hundel)) {
    errors.hundel = "User_Name feild is required";
  }
  if (!Validator.isLength(data.hundel, { min: 4, max: 30 })) {
    errors.hundel = "User_Name should be between 4 and 30 word";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password feild is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 25 })) {
    errors.password = "Password length should be between 6 and 30";
  }
  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Password verification is required";
  }
  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Passwords should match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
