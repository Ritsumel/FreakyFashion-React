const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, '../../data/freaky-fashion.db')
);

/**
 * GET /api/search?q=...
 */
router.get('/', (req, res, next) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
    return res.json({ products: [] });
  }

  const sql = `
    SELECT DISTINCT p.*,
      CASE 
        WHEN datetime(p.created_at) >= datetime('now', '-7 days') THEN 1 
        ELSE 0 
      END AS showNewTag
    FROM products p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE p.name        LIKE ?
       OR p.brand       LIKE ?
       OR p.description LIKE ?
       OR c.name        LIKE ?
    ORDER BY datetime(p.created_at) DESC
  `;

  const param = `%${searchTerm}%`;

  db.all(sql, [param, param, param, param], (err, products) => {
    if (err) return next(err);

    res.set('Cache-Control', 'no-store');
    res.json({ products });
  });
});

module.exports = router;
