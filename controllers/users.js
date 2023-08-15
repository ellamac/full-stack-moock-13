const router = require('express').Router();

const { User, Blog, Session } = require('../models');
const { tokenExtractor } = require('../util/middleware');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
      },
    ],
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.status(200).json(user);
});

router.get('/:id', async (req, res) => {
  where = {};
  console.log('W', req.query.read);
  if (
    req.query.read &&
    (req.query.read === 'true' || req.query.read === 'false')
  ) {
    where = {
      read: req.query.read === 'true',
    };
  }

  let err = new Error(`Id should be an integer, you put ${req.params.id}`);
  err.name = 'IdError';
  if (Number.isInteger(parseInt(req.params.id))) {
    let user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Blog,
          as: 'readings',
          through: { where, attributes: ['read', 'id'] },
        },
      ],
    });
    if (user && user !== null) {
      res.status(200).json({
        username: user.username,
        name: user.name,
        readings: user.readings,
      });
    } else {
      err.message = `No user found with the id ${req.params.id}`;
      throw err;
    }
  } else {
    throw err;
  }
});

const userFinder = async (req, res, next) => {
  req.user = await User.findOne({
    where: { username: req.params.username },
  });
  if (req.user && req.user !== null) {
    next();
  } else {
    let err = new Error(
      `No user found with the username ${req.params.username}`
    );
    err.name = 'IdError';
    throw err;
  }
};

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (user.admin) {
    req.admin = true;
  } else {
    req.admin = false;
  }
  next();
};

router.put(
  '/:username',
  userFinder,
  tokenExtractor,
  isAdmin,
  async (req, res) => {
    let err = new Error('unkown error while updating user');

    if (req.body.hasOwnProperty('disabled')) {
      if (req.admin) {
        req.user.disabled = req.body.disabled;
        await req.user.save();
        if (req.body.disabled) {
          await Session.destroy({
            where: { userId: req.user.id },
          });
        }
        return res.status(200).json(req.user);
      } else {
        err.name = 'UpdateError';
        err.message = 'operation not permitted';
        throw err;
      }
    }

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
  }
);
module.exports = router;
