const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const expressMongoSanitize = require('@exortek/express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp');

//Error management imports
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//Router imports
const testRouter = require('./routes/testRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
// Morgan middleware is used for web server information when development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // 100 request same ip
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(expressMongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  }),
);

// Test middleware
// Those routers contain controllers to check user requests
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES MIDDLEWARES
app.use('/test', testRouter);
app.use('/api/v1/users', userRouter);

/** Hatlı girilen url girişi uyarısı*/
app.all('{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
