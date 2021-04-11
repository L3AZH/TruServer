const bcrypt = require("bcrypt");

const hassPassword = async function (password) {
  const salt = await bcrypt.genSalt(13);
  return bcrypt.hash(password, salt);
};

module.exports = hassPassword;
