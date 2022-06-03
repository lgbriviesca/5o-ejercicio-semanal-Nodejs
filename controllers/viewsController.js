const { catchAsync } = require('../utils/catchAsync');

const { User } = require('../models/userModel');
const { Repair } = require('../models/repairModel');

const renderIndex = catchAsync(async (req, res, next) => {
  const users = await User.findAll({ where: { status: 'available' } });
  const repairs = await Repair.findAll();

  res.status(200).render('index', {
    title: 'Title coming from controller',
    users,
    repairs,
  });
});

module.exports = { renderIndex };
