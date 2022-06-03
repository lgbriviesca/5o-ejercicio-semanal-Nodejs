const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const { User } = require('../models/userModel');
const { AppError } = require('../utils/appError');

const { catchAsync } = require('../utils/catchAsync');
const { storage } = require('../utils/firebase');
const { Email } = require('../utils/email');

dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });

  const usersPromises = users.map(async user => {
    const imgRef = ref(storage, user.imgUrl);

    const url = await getDownloadURL(imgRef);

    user.imgUrl = url;

    return user;
  });
  const usersResolved = await Promise.all(usersPromises);

  res.status(200).json({ usersResolved });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`);

  const imgUploaded = await uploadBytes(imgRef, req.file.buffer);

  const salt = await bcrypt.genSalt(12);

  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
    imgUrl: imgUploaded.metadata.fullPath,
  });

  await new Email(newUser.email).sendWelcome(newUser.name);

  newUser.password = undefined;
  newUser.imgUrl = `${imgUploaded.metadata.name} uploaded succesffully`;

  res.status(201).json({ newUser });
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ where: { id } });

  const imgRef = ref(storage, user.imgUrl);

  const url = await getDownloadURL(imgRef);

  user.imgUrl = url;
  user.password = undefined;

  res.status(200).json({ user });
});

const updateUser = catchAsync(async (req, res) => {
  const { user } = req;

  const { name, email } = req.body;

  await user.update({ name, email });

  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res) => {
  const { user } = req;

  await user.update({ status: 'unavailable' });

  res.status(200).json({ status: 'success' });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: 'available' },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(201).json({ user, token });
});

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
};
