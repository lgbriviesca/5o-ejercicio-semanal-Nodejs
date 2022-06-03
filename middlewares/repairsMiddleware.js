const { Repair } = require('../models/repairModel');

const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const repairExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repair = await Repair.findOne({ where: { id,  status: 'pending' } });

  if (!repair) {
    return next(new AppError('Repair does not exist', 404));
  }

  req.repair = repair;

  next();
});

module.exports = { repairExists };
