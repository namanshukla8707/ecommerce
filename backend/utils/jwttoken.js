const sendToken = (user, statusCode, response) => {
  const token = user.getJWTToken();
  const options = {
    maxAge:
      new Date().getTime() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };
  response
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, user });
};
module.exports = sendToken;
