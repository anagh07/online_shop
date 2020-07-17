const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

const rootdir = require('./utils/path');

const app = express();

const adminData = require('./routes/admin');
const shoproute = require('./routes/shop');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootdir, 'public')));

// ROUTES
app.use('/admin', adminData.routes);
app.use(shoproute);

// error route
app.use((req, res) => {
  console.log('Error 404');
  // res.status(404).sendFile(path.join(rootdir, 'views', 'error.html'));
  res.status(404).render('404', { pageTitle: 'error', path: '404' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
