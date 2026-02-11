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

      const relatedQuery = `
        SELECT
          p.id,
          p.name,
          p.brand,
          p.description,
          p.price,
          p.image,
          p.alt,
          p.slug,
          COUNT(pc2.category_id) AS relevance
        FROM products p
        JOIN product_categories pc2 ON pc2.product_id = p.id
        WHERE pc2.category_id IN (
          SELECT category_id
          FROM product_categories
          WHERE product_id = ?
        )
        AND p.id != ?
        AND p.publish_date IS NOT NULL
        GROUP BY p.id
        ORDER BY relevance DESC, p.created_at DESC
      `;

      db.all(
        relatedQuery,
        [product.id, product.id],
        (err2, primaryRelated) => {
          if (err2) return next(err2);

          // If enough, trim and return
          if (primaryRelated.length >= 9) {
            return res.json({
              product,
              relatedProducts: primaryRelated.slice(0, 9)
            });
          }

          // --- FALLBACK FILL ---
          const missing = 9 - primaryRelated.length;
          const usedIds = primaryRelated.map(p => p.id).concat(product.id);
          const placeholders = usedIds.map(() => '?').join(',');

          db.all(
            `
            SELECT id, name, brand, description, price, image, alt, slug
            FROM products
            WHERE publish_date IS NOT NULL
            AND id NOT IN (${placeholders})
            ORDER BY
              CASE WHEN brand = ? THEN 0 ELSE 1 END,
              created_at DESC
            LIMIT ?
            `,
            [...usedIds, product.brand, missing],
            (err3, fallback) => {
              if (err3) return next(err3);

              const combined = [...primaryRelated, ...fallback];

              res.json({
                product,
                relatedProducts: combined
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;
