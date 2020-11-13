const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function (data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email feild is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is not valid";
  }
  
  
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password feild is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 25 })) {
    errors.password = "Password length should be between 6 and 30";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
