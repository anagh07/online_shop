module.exports = {
  getAllProd: 'SELECT * FROM products',
  insertProd:
    'INSERT INTO products (title, price, imageUrl, `desc`) VALUES (?, ?, ?, ?)',
  findProd: 'SELECT * FROM products WHERE id = ?',
};
