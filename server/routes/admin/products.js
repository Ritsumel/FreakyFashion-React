const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, '../../data/freaky-fashion.db')
);

/**
 * GET all products (admin)
 * URL: http://localhost:5000/admin/products
 */
router.get('/', (req, res, next) => {
  db.all(
    'SELECT * FROM products ORDER BY name ASC',
    [],
    (err, products) => {
      if (err) return next(err);

      res.json({
        products,
        productCount: products.length
      });
    }
  );
});

/**
 * DELETE product (admin)
 * URL: http://localhost:5000/admin/products/:id
 */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) return next(err);
    res.json({ success: true });
  });
});

module.exports = router;
