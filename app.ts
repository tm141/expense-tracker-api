import express from 'express';
import createError from 'http-errors';
import expenseRouter from './routes/expense';



let app = express();
let port = "3000"

app.use(express.urlencoded());
app.use(express.json({
  strict: false
}));
app.use('/api/', expenseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err:any, req:express.Request, res:express.Response ) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;

