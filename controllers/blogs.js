const router = require('express').Router();

const { Blog } = require('../models');

router.get('/', async (req, res) => {
  let blogs = await Blog.findAll();
  return res.status(200).json(blogs);
});

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body);
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

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy();
  res.json(req.blog);
});

module.exports = router;
