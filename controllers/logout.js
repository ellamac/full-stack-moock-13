const jwt = require('jsonwebtoken');
const router = require('express').Router();

const { Session } = require('../models');
const { tokenExtractor } = require('../util/middleware');

router.delete('/', tokenExtractor, async (req, res) => {
  await Session.destroy({
    where: { userId: req.decodedToken.id },
  });
  res.status(200);
});

module.exports = router;
