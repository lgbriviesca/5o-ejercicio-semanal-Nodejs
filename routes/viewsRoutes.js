const express = require('express');

const { renderIndex } = require('../controllers/viewsController.js');

const router = express.Router();

router.get('/', renderIndex);

module.exports = { viewsRouter: router };
