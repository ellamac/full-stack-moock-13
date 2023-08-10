const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    console.log(authorization.substring(7));
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = {
  tokenExtractor,
};
