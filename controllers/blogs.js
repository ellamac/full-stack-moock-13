const router = require('express').Router();

const { Blog, User } = require('../models');
const { tokenExtractor } = require('../util/tokenExtractor');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  where = {};
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ],
    };
  }

  let blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  });
  return res.status(200).json(blogs);
});

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
    date: new Date(),
  });
  return res.status(201).json(blog);
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (req.blog && req.blog !== null) {
    next();
  } else {
    let err = new Error(`No blog found with the id ${req.params.id}`);
    err.name = 'IdError';
    throw err;
  }
};

router.get('/:id', blogFinder, async (req, res, next) => {
  return res.status(200).json(req.blog);
});

router.put('/:id', blogFinder, async (req, res) => {
  if (req.body.likes) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.status(200).json(req.blog);
  } else {
    let err = new Error('blog.likes cannot be undefined');
    err.name = 'UpdateError';
    throw err;
  }
});

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (user.id === req.blog.userId) {
    await req.blog.destroy();
    res.json(req.blog);
  } else {
    let err = new Error("Only blog's creator can delete it");
    err.name = 'IdError';
    throw err;
  }
});

module.exports = router;
