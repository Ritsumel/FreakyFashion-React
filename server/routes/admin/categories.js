const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, '../../data/freaky-fashion.db')
);

/**
 * GET all categories (admin)
 * URL: http://localhost:5000/api/admin/categories
 */
router.get('/', (req, res, next) => {
  const query = `
    SELECT
      c.id,
      c.name,
      c.slug,
      c.image_url,
      (
        SELECT COUNT(*)
        FROM product_categories pc
        WHERE pc.category_id = c.id
      ) AS productCount
    FROM categories c
    ORDER BY c.name
  `;

  db.all(query, [], (err, rows) => {
    if (err) return next(err);

    // fallback image like old project
    rows.forEach(row => {
      if (!row.image_url || row.image_url.trim() === '') {
        row.image_url = '/images/freakyfashion-placeholder.png';
      }
    });

    res.json({ categories: rows });
  });
});

/**
 * GET single category + products (admin)
 * URL: /api/admin/categories/:id
 */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  // 1. Fetch category
  db.get(
    `SELECT id, name, slug, image_url
     FROM categories
     WHERE id = ?`,
    [id],
    (err, category) => {
      if (err) return next(err);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // fallback image
      if (!category.image_url || category.image_url.trim() === '') {
        category.image_url = '/images/freakyfashion-placeholder.png';
      }

      // 2. Fetch products in category
      db.all(
        `
        SELECT p.id, p.name, p.sku
        FROM products p
        JOIN product_categories pc ON pc.product_id = p.id
        WHERE pc.category_id = ?
        ORDER BY p.name
        `,
        [id],
        (err2, products) => {
          if (err2) return next(err2);

          res.json({
            ...category,
            products
          });
        }
      );
    }
  );
});

/**
 * UPDATE category (admin)
 * URL: PUT /api/admin/categories/:id
 */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, slug, image_url, productIds } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: 'Name and slug are required' });
  }

  // normalize empty image
  const imageValue =
    image_url && image_url.trim() !== '' ? image_url : null;

  // 1. Update category
  db.run(
    `
    UPDATE categories
    SET name = ?, slug = ?, image_url = ?
    WHERE id = ?
    `,
    [name, slug, imageValue, id],
    function (err) {
      if (err) return next(err);

      // 2. Remove old product relations
      db.run(
        'DELETE FROM product_categories WHERE category_id = ?',
        [id],
        err2 => {
          if (err2) return next(err2);

          // 3. Reinsert selected products
          if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.json({ success: true });
          }

          const stmt = db.prepare(
            `INSERT INTO product_categories (product_id, category_id)
             VALUES (?, ?)`
          );

          productIds.forEach(pid => {
            stmt.run([pid, id]);
          });

          stmt.finalize(() => {
            res.json({ success: true });
          });
        }
      );
    }
  );
});


/* POST new category */
router.post('/', (req, res, next) => {
  const { name, image_url, productIds = [] } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  // Insert category
  db.run(
    `INSERT INTO categories (name, slug, image_url)
     VALUES (?, ?, ?)`,
    [name, slug, image_url || null],
    function (err) {
      if (err) return next(err);

      const categoryId = this.lastID;

      // No products? Done.
      if (!productIds.length) {
        return res.status(201).json({ success: true });
      }

      // Insert product relations
      const values = productIds.map(pid => [pid, categoryId]);

      const placeholders = values.map(() => '(?, ?)').join(',');
      const flatValues = values.flat();

      db.run(
        `
        INSERT INTO product_categories (product_id, category_id)
        VALUES ${placeholders}
        `,
        flatValues,
        err2 => {
          if (err2) return next(err2);
          res.status(201).json({ success: true });
        }
      );
    }
  );
});

/**
 * DELETE category
 * URL: POST /api/admin/categories/:id/delete
 */
router.post('/:id/delete', (req, res, next) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM product_categories WHERE category_id = ?',
    [id],
    err => {
      if (err) return next(err);

      db.run(
        'DELETE FROM categories WHERE id = ?',
        [id],
        err2 => {
          if (err2) return next(err2);
          res.json({ success: true });
        }
      );
    }
  );
});

module.exports = router;
