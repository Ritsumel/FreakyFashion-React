const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const slugify = require('../../utils/slugify');
const matchCategories = require('../../utils/matchCategories');
const normalize = require('../../utils/normalize');

const db = new sqlite3.Database(
  path.join(__dirname, '../../data/freaky-fashion.db')
);

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

/**
 * GET products (admin)
 * Optional SKU filter
 * /api/admin/products?sku=ABC
 */
router.get('/', (req, res, next) => {
  const { sku } = req.query;

  if (sku) {

    db.all(
      `
      SELECT id, name, sku
      FROM products
      WHERE UPPER(sku) LIKE UPPER(?)
      ORDER BY name
      `,
      [`%${sku}%`],
      (err, products) => {
        if (err) return next(err);

        console.log('SKU QUERY:', sku);
        console.log('SKU QUERY RESULT:', products);

        return res.json(products);
      }
    );
    return;
  }

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
 * DELETE product (admin)
 * URL: http://localhost:5000/admin/products/:id
 */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  // First remove category relations
  db.run(
    'DELETE FROM product_categories WHERE product_id = ?',
    [id],
    err => {
      if (err) return next(err);

      // Then remove product
      db.run(
        'DELETE FROM products WHERE id = ?',
        [id],
        function (err2) {
          if (err2) return next(err2);
          res.json({ success: true });
        }
      );
    }
  );
});


/* POST new product (admin) */
router.post('/', (req, res, next) => {
  const { name, description, brand, sku, image, publish } = req.body;
  const price = parseFloat(req.body.price) || 0;
  const alt = `${name} - ${brand}`;

  if (!name || !sku) {
    return res.status(400).json({ error: 'Name and SKU are required' });
  }

  const now = new Date()
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19);

  const publishDate = publish ? now : null;

  const insertQuery = `
    INSERT INTO products (
      name,
      description,
      brand,
      image,
      sku,
      price,
      created_at,
      publish_date,
      alt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    insertQuery,
    [name, description, brand, image || null, sku, price, now, publishDate, alt],
    function (err) {
      if (err) return next(err);

      const productId = this.lastID;
      const slug = `${slugify(name)}-${productId}`;

      // Update slug
      db.run(
        'UPDATE products SET slug = ? WHERE id = ?',
        [slug, productId],
        err2 => {
          if (err2) return next(err2);

          // Fetch all categories
          db.all(
            'SELECT id, name FROM categories',
            [],
            (err3, categories) => {
              if (err3) return next(err3);

              // Match categories
              const matched = matchCategories(
                `${name} ${description || ''} ${brand || ''}`,
                categories,
                normalize
              );

              // No matches? Done.
              if (!matched.length) {
                res.status(201).json({
                  success: true,
                  productId
                });
              }

              // Insert relations
              const stmt = db.prepare(
                'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)'
              );

              matched.forEach(cat => {
                stmt.run(productId, cat.id);
              });

              stmt.finalize(() => {
                res.status(201).json({
                  success: true,
                  productId
                });
              });
            }
          );
        }
      );
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
