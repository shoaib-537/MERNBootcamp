const { sign, verify } = require("jsonwebtoken");
const { signup } = require("../beans/common");
const {
  usersController,
  adminsController,
  clientController,
} = require("../controllers");

const executeLogin = async (username, password, cb) => {
  try {
    const filter = { userName: username, password: password };
    const user = await usersController.getUser(filter);
    console.log(user);
    if (!user) {
      return cb(null, false);
    }
    return cb(null, user);
  } catch (err) {
    return cb(null, false);
  }
};
const generateToken = async (req, res, next) => {
  const user = req.user;
  const token = sign({
    user: user._id
  }, 'someSecretValue');
  req.token = token;
  next();
};
const respond = async (req, res, next) => {
  const user = req.user;

  const userType = user.userType.kind;
  const item = user.userType.item;

  let data = null;

  if (userType === "admin") {
    data = await adminsController.getAdmin({ _id: item });
  }

  if (userType === "clinet") {
    data = await adminsController.getClient({ _id: item });
  }

  const result = { token: req.token, user: data };
  res.status(200).send(result);
};
const userSignUp = async (req, res, next) => {
  const body = req.body;
  try {
    const result = await signup(body);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = {
  userSignUp,
  executeLogin,
  generateToken,
  respond,
};
