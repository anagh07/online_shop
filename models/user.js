const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        prodId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        qty: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProdIndex = this.cart.items.findIndex((prod) => {
    return prod.prodId.toString() === product._id.toString();
  });

  let updatedCartItems = [...this.cart.items];
  let newQty = 1;

  if (cartProdIndex >= 0) {
    // Item exists
    newQty = updatedCartItems[cartProdIndex].qty + 1;
    updatedCartItems[cartProdIndex].qty = newQty;
  } else {
    // Items does not exist in cart
    updatedCartItems.push({
      prodId: product._id,
      qty: newQty,
    });
  }

  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function (prodId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.prodId.toString() !== prodId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
