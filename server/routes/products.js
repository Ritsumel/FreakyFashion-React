const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, '../data/freaky-fashion.db')
);

/**
 * GET /api/products
 * Public products list
 */
router.get('/', (req, res, next) => {
  db.all(
    `
    SELECT *
    FROM products
    WHERE publish_date IS NOT NULL
    ORDER BY created_at DESC
    `,
    [],
    (err, products) => {
      if (err) return next(err);
      res.json({ products });
    }
  );
});

/**
 * GET /api/products/:slug
 * Public product details
 */
router.get('/:slug', (req, res, next) => {
  const slug = req.params.slug;

  db.get(
    `
    SELECT *
    FROM products
    WHERE slug = ?
    AND publish_date IS NOT NULL
    `,
    [slug],
    (err, product) => {
      if (err) return next(err);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      db.all(
        `
        SELECT *
        FROM products
        WHERE id != ?
        AND publish_date IS NOT NULL
        ORDER BY created_at DESC
        LIMIT 12
        `,
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
