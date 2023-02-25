
// app ori
// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// const mongoose = require('mongoose');

// var app = express();



// // mongose setup
// mongoose.connect('mongodb://localhost:27017/db-onlineattendance',
// // mongoose.connect('mongodb+srv://edson:rhWnIbffzfMmw3oz@cluster0.b5u5e.mongodb.net/?retryWrites=true&w=majority',
// {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   // useCreateIndex: true,
//   // useFindAndModify: true
// });
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var apiRouter = require('./routes/api')




// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/user/api/v1', apiRouter); 

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;

// batas

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override') // untuk menghandle put
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//router admin
const adminRouter = require('./routes/admin')
// const apiRouter = require('./routes/api') old
var apiRouter = require('./routes/api')

// const cors = require('cors')

// app.use(cors())

// untuk handle siapa sja yang dapat mengakses API kita
app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin','*') // Origin = url yang ingin di berikan akses API 
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE, OPTIONS') // method = method dalam penggunaan API 
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization, Accept') // Content-Type = contohnya json, (xml, html?) dll. // Authorization = berguna ketika proses pengiriman token kedalam API
//   res.setHeader('Content-Type','application/json') // Content-Type = contohnya json, (xml, html?) dll. // Authorization = berguna ketika proses pengiriman token kedalam API
  next(); // agar requestnya tidak berhenti sampai disitu
})


// app.use((req,res,next)=>{
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT, PATCH');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');
//   next()
// })

// app.use((req,res,next)=>{
//   res.setHeader("Access-Control-Allow-Origin", '*');
//   res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Accept');
//   next();
// })

//import mongoose
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/db-onlineattendance')
mongoose.connect('mongodb+srv://vocsukapp:m84LQy6BW5EuE0QI@vocs-db.emmvr9k.mongodb.net/?retryWrites=true&w=majority')
// mongoose.connect('mongodb+srv://vocsukapp:m84LQy6BW5EuE0QI@vocs-db.emmvr9k.mongodb.net/?retryWrites=true&w=majority',
// {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: true
// });






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge : 600000000}
}))
app.use(flash())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/sb-admin-2', express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2'))); // untuk mengarahkan ke path direktori sb-admin-2

app.use('/', indexRouter);
app.use('/users', usersRouter);

//admin
app.use('/admin', adminRouter)
//api
app.use('/api/v1/member', apiRouter)
app.use('/user/api/v1', apiRouter); 


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
