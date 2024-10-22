'use strict';

require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// save base folder location
global.__baseFolder = __dirname;

const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authMiddleware = require('./middlewares/auth');

// Swagger API
const swaggerRouter = require('./routes/swagger');

// Authentication API
const authRouter = require('./routes/auth');

// Registration API
const registerRouter = require('./routes/register');
const pollRouter = require('./routes/registerScanner/poll');
const claimRouter = require('./routes/registerScanner/claim');

// Storage API
const storageRouter = require('./routes/storage');

// Cloud API
const scannersRouter = require('./routes/scanner');
const accountRouter = require('./routes/account');
const blocksRouter = require('./routes/block');
const jobRouter = require('./routes/job');
const scannerSettingRouter = require('./routes/scannersetting');
const scannerStateRouter = require('./routes/scannerstate');
const scannerHistoryRouter = require('./routes/scannerhistory');
const dashboardRouter = require('./routes/dashboard');
const pluginRouter = require('./routes/plugin');
const opentextRouter = require('./routes/opentext');
const c2paRouter = require('./routes/c2pa');
const barleaRouter = require('./routes/barlea');

// Local API
const localRouter = require('./routes/local');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('short'));
}

app.enable('trust proxy');

app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

var corsOptions = {
  origin: process.env.FRONTEND_URL.replace(/\/$/, ''), // Remove trailing slash
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// DEBUGGER
// app.use('*', (req, res, next) => {
//   console.log(req.originalUrl);
//   next();
// });

// Auth routes - does NOT require auth middleware
app.use('/api/auth', authRouter);

// Swagger API route - does NOT require auth middleware
app.use('/api/swagger', swaggerRouter);

// Registration route - does NOT require auth middleware
app.use('/api/register', registerRouter);

app.use('/api/poll', pollRouter);

// User registration route
const { createAccount } = require('./controllers/account.controller');
app.post('/api/register/accounts', createAccount);

// Auth middleware - applies only to protected routes
app.use([
  '/api/claim', '/api/scanners', '/api/storage', '/api/accounts',
  '/api/jobs', '/api/scannersetting', '/api/dashboard', '/api/plugin',
  '/api/opentext', '/api/barlea', '/api/c2pa'
], authMiddleware);

// Storage route - requires auth middleware
app.use('/api/storage', storageRouter);

// Claim route - requires auth middleware
app.use('/api/claim', claimRouter);

// Scanner-related routes
app.use('/api/scanners/state', scannerStateRouter);
app.use('/api/scanners/history', scannerHistoryRouter);
app.use('/api/scanners', scannersRouter);

// Account-related routes
app.use('/api/accounts', accountRouter);

// Job-related routes
app.use('/api/jobs', jobRouter);

// Scanner setting route
app.use('/api/scannersetting', scannerSettingRouter);

// Dashboard route
app.use('/api/dashboard', dashboardRouter);

// Plugin route
app.use('/api/plugin', pluginRouter);

// Opentext Route
app.use('/api/opentext', opentextRouter);

// Barlea Route
app.use('/api/barlea', barleaRouter);

// C2PA Route
app.use('/api/c2pa', c2paRouter);

// Endpoints for exercise
app.use('/api/exercise', require('./routes/exercise.route'));

// Sub-routes for scanner
scannersRouter.use('', blocksRouter);
scannersRouter.use('', localRouter);

// Database connection
console.log('---------------------------database');
console.log(process.env.MONGODB_URL);

const db = require('./models');
db.connectDB()
  .then(() => {
    console.log('db connected');
  })
  .catch((err) => {
    console.log('Failed to connect database:', err.message);
    process.exit(0);
  });

// Load scanner settings
const checkAndLoadScannerSettings = async () => {
  const scannerSettingsList = require('./lib/config/scannerSettings.json');
  const { insertFromJSON, getAllScannerSettings } = require('./services/scannersetting');
  console.log('Checking scanner settings...');
  const scannerSettings = await getAllScannerSettings();
  
  if (scannerSettings.length === 0) {
    console.log('Loading default settings...');
    await insertFromJSON(scannerSettingsList);
  } else {
    console.log('Settings already loaded...');
  }
};
checkAndLoadScannerSettings();

// Redirect root path to frontend URL
app.get('/', (req, res) => {
  res.status(301).redirect(process.env.FRONTEND_URL);
});

module.exports = app;