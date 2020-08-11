exports.get404 = (req, res) => {
  console.log('Error 404');
  // res.status(404).sendFile(path.join(rootdir, 'views', 'error.html'));
  res.status(404).render('404', {
    pageTitle: 'error',
    path: '404',
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.get500 = (req, res) => {
  console.log('Error 500');
  // res.status(404).sendFile(path.join(rootdir, 'views', 'error.html'));
  res.status(500).render('500', {
    pageTitle: 'server error',
    path: '500',
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.serverErrorHandle = (err, next) => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
};
