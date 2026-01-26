const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, '../data/freaky-fashion.db')
);

/**
 * GET /api/checkout
 * Returns basket summary
 */
router.get('/', (req, res) => {
  const basket = req.session.basket || [];

  if (basket.length === 0) {
    return res.status(400).json({ error: 'Basket is empty' });
  }

  res.json({ basket });
});

/**
 * POST /api/checkout
 * Place order
 */
router.post('/', (req, res, next) => {
  const {
    name,
    lastName,
    email,
    street,
    postal,
    city,
    newsletter
  } = req.body;

  const basket = req.session.basket || [];

  if (
    !name ||
    !lastName ||
    !email ||
    !street ||
    !postal ||
    !city
  ) {
    return res.status(400).json({
      error: 'Missing required fields'
    });
  }

  if (basket.length === 0) {
    return res.status(400).json({
      error: 'Basket is empty'
    });
  }

  const totalPrice = basket.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.run(
      `
      INSERT INTO orders
      (first_name, last_name, email, street, postal_code, city, newsletter_option, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        lastName,
        email,
        street,
        postal,
        city,
        newsletter ? 1 : 0,
        totalPrice
      ],
      function (err) {
        if (err) {
          db.run('ROLLBACK');
          return next(err);
        }

        const orderId = this.lastID;

        const stmt = db.prepare(`
          INSERT INTO order_items
          (order_id, product_id, quantity, price_per_item)
          VALUES (?, ?, ?, ?)
        `);

        basket.forEach(item => {
          stmt.run(
            orderId,
            item.id,
            item.quantity,
            item.price
          );
        });

        stmt.finalize();
        db.run('COMMIT');

        req.session.lastOrder = {
        orderId,
        name,
        lastName,
        totalPrice
        };

        req.session.basket = [];

        res.json({
          success: true,
          orderId,
          totalPrice
        });
      }
    );
  });
});

module.exports = router;
