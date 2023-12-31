const logger = require('./logger');

const requestLogger = (request, response, next) => {
  console.log(request.body);
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    console.log('--------CastError--------');
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'IdError') {
    console.log('--------IdError--------');
    return response.status(404).send({ error: error.message });
  } else if (error.name === 'ValidationError' || error.name === 'UpdateError') {
    console.log('--------ValidationError--------');
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'SequelizeValidationError') {
    console.log('--------SequelizeValidationError--------');
    return response.status(404).send({ error: error.message });
  }

  next(error);
};

const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');
const { Session } = require('../models');

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    console.log(authorization.substring(7));
    let decodedToken = jwt.verify(authorization.substring(7), SECRET);
    const session = await Session.findOne({
      where: { userId: decodedToken.id },
    });
    if (session && session !== null) {
      req.decodedToken = decodedToken;
    } else {
      return res.status(401).json({ error: 'user has been logged out' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
