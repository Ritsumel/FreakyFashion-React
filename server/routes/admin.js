const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

/* ===== Multer ===== */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/products'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ===== Routes ===== */

/* GET all products */
router.get('/products', (req, res, next) => {
  db.all('SELECT * FROM products ORDER BY name ASC', [], (err, products) => {
    if (err) return next(err);

    res.json({
      products,
      productCount: products.length
    });
  });
});

/* POST new product */
router.post('/products', upload.single('image'), (req, res, next) => {
  const { name, description, brand, sku } = req.body;
  const price = parseFloat(req.body.price) || 0;
  const image = req.file ? req.file.filename : null;
  const alt = `${name} - ${brand}`;

  const createdAt = new Date(req.body['publication-date'])
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19);

  const categories = Array.isArray(req.body.categories)
    ? req.body.categories
    : req.body.categories ? [req.body.categories] : [];

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
        (err) => {
          if (err) return next(err);

          categories.forEach(category => {
            db.run(
              'INSERT OR IGNORE INTO categories (name) VALUES (?)',
              [category]
            );
          });

          res.status(201).json({
            success: true,
            productId
          });
        }
      );
    }
  );
});

/* DELETE product */
router.delete('/products/:id', (req, res, next) => {
  const id = req.params.id;

  db.get(
    'SELECT image FROM products WHERE id = ?',
    [id],
    (err, product) => {
      if (err) return next(err);
      if (!product) return res.status(404).json({ error: 'Not found' });

      const imagePath = product.image
        ? path.join(__dirname, '../public/images/products', product.image)
        : null;

      db.run('DELETE FROM product_categories WHERE product_id = ?', [id], () => {
        db.run('DELETE FROM products WHERE id = ?', [id], () => {
          if (imagePath) fs.unlink(imagePath, () => {});
          res.json({ success: true });
        });
      });
    }
  );
});

module.exports = router;
