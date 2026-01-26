const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, '../data/freaky-fashion.db')
);

/**
 * GET /api/products/:slug
 * Public product details
 */
router.get('/:slug', (req, res, next) => {
  const slug = req.params.slug;

  db.get(
    'SELECT * FROM products WHERE slug = ?',
    [slug],
    (err, product) => {
      if (err) return next(err);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      db.all(
        'SELECT * FROM products WHERE id != ? ORDER BY created_at DESC LIMIT 12',
        [product.id],
        (err, relatedProducts) => {
          if (err) return next(err);

          res.json({
            product,
            relatedProducts
          });
        }
      );
    }
  );
});

module.exports = router;
