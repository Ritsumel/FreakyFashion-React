const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, '../../data/freaky-fashion.db')
);

// GET /api/confirmation
router.get('/', (req, res) => {
  const lastOrder = req.session.lastOrder;

  if (!lastOrder) {
    return res.status(404).json({ error: 'No order found' });
  }

  const { orderId, name, lastName, totalPrice } = lastOrder;

  db.all(
    `
    SELECT 
      oi.quantity,
      oi.price_per_item AS price,
      p.name
    FROM order_items oi
    LEFT JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?
    `,
    [orderId],
    (err, items) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to load order items' });
      }

      res.json({
        customer: { name, lastName },
        basket: items,
        totalPrice
      });

      // clear session AFTER fetch
      req.session.lastOrder = null;
    }
  );
});

module.exports = router;
