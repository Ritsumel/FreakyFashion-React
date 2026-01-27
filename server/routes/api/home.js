const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, '../../data/freaky-fashion.db')
);

router.get('/', (req, res, next) => {
  // Fetch spots
  db.all('SELECT * FROM spots LIMIT 3', [], (err, spots) => {
    if (err) return next(err);

    // Fetch hero (there is always only ONE)
    db.get('SELECT * FROM hero LIMIT 1', [], (err, hero) => {

      if (err) return next(err);

      // Calculate 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Fetch products
      db.all(
        `
        SELECT *,
        CASE 
          WHEN datetime(created_at) >= datetime(?) THEN 1 
          ELSE 0 
        END AS showNewTag
        FROM products
        WHERE datetime(created_at) <= datetime('now')
        ORDER BY datetime(created_at) DESC
        LIMIT 8
        `,
        [sevenDaysAgo.toISOString()],
        (err, products) => {
          if (err) return next(err);

          res.set('Cache-Control', 'no-store');

          res.json({
            hero,
            spots,
            products
          });
        }
      );
    });
  });
});

module.exports = router;
