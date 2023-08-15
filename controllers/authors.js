const router = require('express').Router();

const { Blog } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../util/db');

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

  let authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('count', sequelize.col('title')), 'blogs'],
      [sequelize.fn('sum', sequelize.col('likes')), 'likes'],
    ],
    group: ['author'],
    order: [['likes', 'DESC']],
    where,
  });
  return res.status(200).json(authors);
});

module.exports = router;
