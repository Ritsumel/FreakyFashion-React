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

/**
 * GET single product (admin)
 * URL: http://localhost:5000/api/admin/products/:id
 */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  db.get(
    'SELECT * FROM products WHERE id = ?',
    [id],
    (err, product) => {
      if (err) return next(err);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (product.publish_date) {
        const date = new Date(product.publish_date);
        product.publishDate = date.toLocaleString('sv-SE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(',', '');
      } else {
        product.publishDate = null;
      }

      res.json(product);
    }
  );
});

/**
 * TOGGLE publish / unpublish product (admin)
 * POST /api/admin/products/:id/toggle-publish
 */
router.post('/:id/toggle-publish', (req, res, next) => {
  const { id } = req.params;

  db.get(
    'SELECT publish_date FROM products WHERE id = ?',
    [id],
    (err, row) => {
      if (err) return next(err);
      if (!row) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (row.publish_date) {
        // UNPUBLISH
        db.run(
          'UPDATE products SET publish_date = NULL WHERE id = ?',
          [id],
          err => {
            if (err) return next(err);
            res.json({ success: true, published: false });
          }
        );
      } else {
        // PUBLISH
        const now = new Date().toISOString();
        db.run(
          'UPDATE products SET publish_date = ? WHERE id = ?',
          [now, id],
          err => {
            if (err) return next(err);
            res.json({ success: true, published: true, publishDate: now });
          }
        );
      }
    }
  );
});


module.exports = router;
