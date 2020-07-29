const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

const rootdir = require('./utils/path');
const sequelize = require('./utils/database');

const app = express();

const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const error404Route = require('./controllers/error');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootdir, 'public')));

// Middleware
app.use((req, res, next) => {
  User.findById(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// ROUTES
app.use('/admin', adminRoute);
app.use(shopRoute);

// error route
app.use(error404Route.get404);

// DB: Associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

// Create/sync tables with models
sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    console.log('DB synced with models');
    return User.findById(1);
  })
  .then((user) => {
    if (!user) return User.create({ name: 'Anagh', email: 'anagh@mail.com' });
    return Promise.resolve(user);
  })
  .then((user) => {
    // console.log(user);
    user.createCart();
  })
  .then((cart) => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.log(err));
