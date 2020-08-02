exports.get404 = (req, res) => {
  console.log('Error 404');
  // res.status(404).sendFile(path.join(rootdir, 'views', 'error.html'));
  res
    .status(404)
    .render('404', {
      pageTitle: 'error',
      path: '404',
      isLoggedIn: req.session.isLoggedIn,
    });
};
