const express = require('express');

const { body } = require('express-validator');

const { repairExists } = require('../middlewares/repairsMiddleware');
const {
  protectEmployees,
  protectToken,
} = require('../middlewares/usersMiddleware');

const {
  createRepairValidations,
  checkValidations,
} = require('../middlewares/validationsMiddlewares');

const {
  getAllRepairs,
  createRepair,
  getRepairById,
  updateRepair,
  deleteRepair,
} = require('../controllers/repairController');

const router = express.Router();

router.use(protectToken);

router
  .route('/')
  .get(protectEmployees, getAllRepairs)
  .post(createRepairValidations, checkValidations, createRepair);

router
  .use('/:id', repairExists, protectEmployees)
  .route('/:id')
  .get(getRepairById)
  .patch(updateRepair)
  .delete(deleteRepair);

module.exports = { repairsRouter: router };
