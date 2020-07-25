const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

const rootdir = require('./utils/path');
const sequelize = require('./utils/database');

const app = express();

const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const error404Route = require('./controllers/error');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootdir, 'public')));

// ROUTES
app.use('/admin', adminRoute);
app.use(shopRoute);

// error route
app.use(error404Route.get404);

// Create/sync tables with models
sequelize
  .sync()
  .then((result) => {
    console.log('DB synced with models');
  })
  .catch((err) => console.log(err));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
