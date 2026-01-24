const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/* ===== Helpers ===== */
function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/* ===== Database ===== */
const db = new sqlite3.Database(
  path.join(__dirname, '../data/freaky-fashion.db')
);

/* ===== Routes ===== */

/* GET all products (admin) */
router.get('/products', (req, res, next) => {
  db.all('SELECT * FROM products ORDER BY name ASC', [], (err, products) => {
    if (err) return next(err);

    res.json({
      products,
      productCount: products.length
    });
  });
});

/* POST new product (admin) */
router.post('/products', (req, res, next) => {
  const { name, description, brand, sku, image } = req.body;
  const price = parseFloat(req.body.price) || 0;
  const alt = `${name} - ${brand}`;

  const createdAt = new Date()
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19);

  const insertQuery = `
    INSERT INTO products (name, description, brand, image, sku, price, created_at, alt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    insertQuery,
    [name, description, brand, image, sku, price, createdAt, alt],
    function (err) {
      if (err) return next(err);

      const productId = this.lastID;
      const slug = `${slugify(name)}-${productId}`;

      db.run(
        'UPDATE products SET slug = ? WHERE id = ?',
        [slug, productId],
        () => {
          res.status(201).json({ success: true });
        }
      );
    }
  );
});

/* DELETE product (admin) */
router.delete('/products/:id', (req, res, next) => {
  const id = req.params.id;

  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) return next(err);
    res.json({ success: true });
  });
});

module.exports = router;
