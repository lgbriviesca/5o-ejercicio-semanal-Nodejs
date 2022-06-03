const { Repair } = require('../models/repairModel');
const { User } = require('../models/userModel');
const { Email } = require('../utils/email');

const { catchAsync } = require('../utils/catchAsync');

const getAllRepairs = catchAsync(async (req, res, next) => {
  const repairs = await Repair.findAll({
    include: [{ model: User }],
  });
  res.status(200).json({ repairs });
});

const createRepair = catchAsync(async (req, res, next) => {
  const { date, computerNumber, comments, userId } = req.body;

  const newRepair = await Repair.create({
    date,
    computerNumber,
    comments,
    userId,
  });

  res.status(201).json({ newRepair });
});

const getRepairById = catchAsync(async (req, res, next) => {
  const { repair } = req;

  res.status(200).json({ repair });
});

const updateRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;
  const { status } = req.body;

  await repair.update({ status });

  const user = await User.findOne({ where: { id: repair.userId } });

  await new Email(user.email).sendNotice(user.name);

  res.status(200).json({ status: 'success' });
});

const deleteRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  await repair.update({ status: 'cancelled' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  getAllRepairs,
  createRepair,
  getRepairById,
  updateRepair,
  deleteRepair,
};
