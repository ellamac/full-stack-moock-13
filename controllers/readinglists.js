const router = require('express').Router();
const { tokenExtractor } = require('../util/middleware');

const Readinglist = require('../models/readinglist');

router.post('/', async (req, res) => {
  const list = await Readinglist.create(req.body);
  res.status(200).json(list);
});

router.put('/:id', tokenExtractor, async (req, res) => {
  let reading = await Readinglist.findOne({
    where: { userId: req.decodedToken.id, blogId: req.params.id },
  });
  if (reading && reading !== null) {
    reading.read = req.body.read;
    await reading.save();
    res.status(200).json(reading);
  } else {
    let err = new Error(
      `Cannot find a blog with id ${req.params.id} in your readinglist`
    );
    err.name = 'UpdateError';
    throw err;
  }
});
module.exports = router;
