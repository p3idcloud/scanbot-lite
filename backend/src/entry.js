'use strict';

// save base folder location
global.__baseFolder = __dirname;

const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const logger = require('morgan');
// const applogger = require('../../utils/logger')('express');
// const jwt = require("jsonwebtoken");
const authMiddleware = require('./middlewares/auth');

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

// Status API
// const serviceStatusRouter = require('../../routes/servicestatus');

// Authentication API
// const authRouter = require('./routes/auth');

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
const apiKeysRouter = require('./routes/apikeys');

// Local API
const localRouter = require('./routes/local');

const app = express();

// app.use(logger('dev'));
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

// app.use('/api/auth', authRouter);

// Documentation Route
// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'TWAIN Scanner API',
//       version: '1.0.0',
//       description: 'Scanner Api for scanner management'
//     },
//     security: [{ bearerAuth: [] }],
//   },
//   apis: [
//     './models/*.js',
//     './routes/*.js'
//   ],
//   tags: [
//     {
//       'name': 'Scanners',
//       'description': 'API for scanners'
//     },
//     {
//       'name': 'Users',
//       'description': 'API for users'
//     },
//     {
//       name: 'Accounts',
//       description: 'API for accounts'
//     },
//     {
//       name: 'Jobs',
//       description: 'API for Jobs'
//     },
//     {
//       name: 'Profile Definition',
//       description: 'API for manage profile definition'
//     },
//     {
//       name: 'Scanner Setting',
//       description: 'API for manage scanner setting'
//     },
//     {
//       name: 'Scanner State',
//       description: 'API for manage scanner state'
//     },
//     {
//       name: 'Scanner History',
//       description: 'API for manage scanner history'
//     },
//     {
//       name: 'Account Limit',
//       description: 'API for manage account limit'
//     }
//   ],
// };

// const swaggerDocs = swaggerJSDoc(swaggerOptions);
// var options = {
//   explorer: true,
//   swaggerOptions: {
//     url: '/swagger/swagger.json',
//   },
// };
// app.get('/swagger/swagger.json', (req, res) => {
//   res.setHeader('content-type', 'application/json');
//   res.send(swaggerDocs);
// });

// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(null,options));


const { createAccount } = require('./controllers/account.controller');
const url = require("url");
const apikeys = require("./controllers/apikeys.controller");

// app.use('/api/status', serviceStatusRouter);

app.get('/', (req, res) => {
  res.status(301).redirect(process.env.FRONTEND_URL);
})

// Register scanner
app.use('/api/register', registerRouter);

// API that does not require authentication
// app.use('/api/authentication/signin', signinRouter);
// app.use('/api/authentication/refresh', refreshRouter);

app.use('/api/poll', pollRouter);
//user register here
app.post('/api/accounts/register', createAccount);


// Auth middleware
app.use('/api*', authMiddleware);

// Storage
app.use('/api/storage', storageRouter);

// APIs that do require authentication
app.use('/api/claim', claimRouter);
// new routes:
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

app.use('/buckets', require('./routes/upload'));

// // v1 - original APIs with 'privet' prefix
// //scannersRouter.use('/:scannerId/privet/infoex', localRouter);
// //scannersRouter.use('/:scannerId/privet/twaindirect/session', localRouter);
// // v2 - APIs without 'privet' prefix
// //scannersRouter.use('/:scannerId/infoex', localRouter);
// //scannersRouter.use('/:scannerId/twaindirect/session', localRouter);

// const token1 = (jwt.sign(
// {
//   "user": {
//   "attributes": {
//     "firstname": [
//       "Caca"
//     ],
//         "lastname": [
//       "Cahyadi"
//     ],
//         "email": [
//       "ccahyadi@lyrid.io"
//     ],
//         "userid": [
//       "8252ef79-9281-4e60-afe4-7eea71f27744"
//     ]
//   }
// }}
// ,process.env.JWT_SECRET,{expiresIn: process.env.LOGIN_SESSION_DAY+'d'}))
// const token2 = (jwt.sign(
//     {
//       "user": {
//         "attributes": {
//           "firstname": [
//             "Caca Scanner"
//           ],
//           "lastname": [
//             "Admin"
//           ],
//           "email": [
//             "cacaadmin@gmail.com"
//           ],
//           "userid": [
//             "3df633dc-0328-45c5-8f87-03b457a3829f"
//           ]
//         }
//       }
//     }
//     ,process.env.JWT_SECRET,{expiresIn: process.env.LOGIN_SESSION_DAY+'d'}))
// const token3 = (jwt.sign(
//     {
//       "user": {
//         "attributes": {
//           "firstname": [
//             "Superadmin"
//           ],
//           "lastname": [
//             "Twain"
//           ],
//           "email": [
//             "twainsuperadmin@example.com"
//           ],
//           "userid": [
//             "fd3677ea-7c84-47a5-b1ae-248ee7b19e53"
//           ]
//         }
//       }
//     }
//     ,process.env.JWT_SECRET,{expiresIn: process.env.LOGIN_SESSION_DAY+'d'}))
// const token4 = (jwt.sign(
//     {
//       "user": {
//         "attributes": {
//           "firstname": [
//             "Low Tier"
//           ],
//           "lastname": [
//             "User"
//           ],
//           "email": [
//             "lowesttier@gmail.com"
//           ],
//           "userid": [
//             "3df621ac-0328-45c5-8287-03b457a3271b"
//           ]
//         }
//       }
//     }
//     ,process.env.JWT_SECRET,{expiresIn: process.env.LOGIN_SESSION_DAY+'d'}))

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