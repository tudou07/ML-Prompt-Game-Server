var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors=require('cors');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

process.env.SECRET_KEY = "ITS A SECRET TO EVERYBODY";
process.env.CLIENT_URL = "https://isa-project-client.web.app";
process.env.SERVER_URL = "https://isa-server.azurewebsites.net";



var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var login = require('./routes/login');
var register = require('./routes/register');
var getImage = require('./routes/getImage');
var forgotPassword = require('./routes/forgotPassword');
var admin = require('./routes/admin');
var logout = require('./routes/logout');

var app = express();

const db = require('./db');
db.setEnvVar();
db.setUpInitialDatabase();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// CORS middleware setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // If credentials need to be sent (e.g., cookies)

  if (req.method === 'OPTIONS') {
    // Handle preflight requests
    res.sendStatus(200);
  }  else {
    next();
  }
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ISA Project API',
      version: '1.0.0',
      description: 'API for ISA Project',
      contact: {
        name: 'Team 2',
        email: '',
      }
    },
    servers: [
      {
        url: 'https://isa-server.azurewebsites.net/',
      },
    ],
  },
  apis:['./routes/*.js'] // Make sure the path here matches your actual route files
}

const spacs = swaggerjsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spacs));

//app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/login', login);
app.use('/register', register);
app.use('/getImage', getImage);
app.use('/user', userRouter);
app.use('/forgotPassword', forgotPassword);
app.use('/admin', admin);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
