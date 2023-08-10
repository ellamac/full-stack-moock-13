const router = require('express').Router();

const { User, Blog } = require('../models');
const { tokenExtractor } = require('../util/tokenExtractor');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.status(200).json(user);
});

const userFinder = async (req, res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } });
  if (req.user && req.user !== null) {
    next();
  } else {
    let err = new Error(`No user found with the id ${req.params.id}`);
    err.name = 'IdError';
    throw err;
  }
};

router.get('/:username', userFinder, async (req, res) => {
  res.status(200).json(req.user);
});

router.put('/:username', userFinder, tokenExtractor, async (req, res) => {
  let err = new Error('unkown error while updating user');
  if (!req.body.username) {
    err.message = 'user.username cannot be undefined';
  } else if (req.params.username !== req.decodedToken.username) {
    err.message = 'Cannot change username if not logged in';
  } else {
    req.user.username = req.body.username;
    await req.user.save();
    return res.status(200).json(req.user);
  }
  err.name = 'UpdateError';
  throw err;
});
module.exports = router;
