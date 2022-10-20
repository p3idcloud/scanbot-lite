'use strict';

// save base folder location
global.__baseFolder = __dirname;

const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const applogger = require('../../utils/logger')('express');
// const jwt = require("jsonwebtoken");
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

// Local API
const localRouter = require('./routes/local');

const app = express();

if ( process.env.NODE_ENV !== 'production' ) {
  const morgan = require('morgan');
  app.use(morgan('short'));
}

app.enable('trust proxy');

app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
var corsOptions = {
  origin: process.env.FRONTEND_URL.slice(0,-1), //removes trailing slash
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

//DEBUGGER
// app.use('*', (req, res, next) => {
//   console.log(req.originalUrl);
//   next();
// })

app.use('/api/auth', authRouter);

// Documentation Route
app.use('/api/swagger', swaggerRouter);


const { createAccount } = require('./controllers/account.controller');

app.get('/', (req, res) => {
  res.status(301).redirect(process.env.FRONTEND_URL);
})

// Register scanner
app.use('/api/register', registerRouter);

app.use('/api/poll', pollRouter);
//user register here
app.post('/api/accounts/register', createAccount);


// Auth middleware
app.use('/api*', authMiddleware);

// Storage
app.use('/api/storage', storageRouter);

// APIs that do require authentication
app.use('/api/claim', claimRouter);

// APIs under scanners (/api/scanners)
app.use('/api/scanners/state', scannerStateRouter);
app.use('/api/scanners/history', scannerHistoryRouter);

app.use('/api/scanners', scannersRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/scannersetting', scannerSettingRouter);
app.use('/api/dashboard', dashboardRouter);

//to use scanner:
scannersRouter.use('', blocksRouter);
scannersRouter.use('', localRouter);

// Database connection
console.log('---------------------------database')
console.log(process.env.MONGODB_URL);
const db = require('./models');
db.connectDB()
  .then(() => {
    console.log('db connected');
  })
  .catch(() => {
    console.log('Failed to connect database');
    process.exit(0);
  });

// Load scanner settings
const checkAndLoadScannerSettings = async () => {
  const scannerSettingsList = require('./lib/config/scannerSettings.json');
  const { insertFromJSON, getAllScannerSettings } = require('./services/scannersetting');
  console.log('Checking scanner settings...')
  const scannerSettings = await getAllScannerSettings();
  if (scannerSettings.length === 0) {
      console.log('Loading default settings...')
      await insertFromJSON(scannerSettingsList);
  } else {
      console.log('Settings already loaded...')
  }
}
checkAndLoadScannerSettings();

module.exports = app;