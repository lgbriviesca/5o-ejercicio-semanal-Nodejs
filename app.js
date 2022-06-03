const express = require('express');
const cors = require('cors');
const { globalErrorHandler } = require('./controllers/errorsController');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { usersRouter } = require('./routes/userRoutes');
const { repairsRouter } = require('./routes/repairRoutes');
const { viewsRouter } = require('./routes/viewsRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

const limiter = rateLimit({
  max: 10000,
  windowMs: 1 * 60 * 60 * 1000, // 1 hr
  message: 'Too many requests from this IP',
});

app.use(limiter);

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/repairs', repairsRouter);
app.use('/', viewsRouter);

app.use('*', globalErrorHandler);

module.exports = { app };
