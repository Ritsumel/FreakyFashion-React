const express = require('express');
const router = express.Router();

/* Ensure basket exists in session */
router.use((req, res, next) => {
  if (!req.session.basket) {
    req.session.basket = [];
  }
  next();
});

/* GET /api/basket */
router.get('/', (req, res) => {
  res.json({
    basket: req.session.basket,
  });
});

/* POST /api/basket/add */
router.post('/add', (req, res) => {
  const { id, slug, name, price, image, brand } = req.body;
  const itemId = String(id);

  const cleanPrice =
    typeof price === 'string'
      ? parseFloat(price.replace(/\D/g, ''))
      : Number(price);

  const existing = req.session.basket.find(
    item => item.id === itemId
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    req.session.basket.push({
      id: itemId,
      slug,
      name,
      price: cleanPrice,
      image,
      brand,
      quantity: 1,
    });
  }

  res.json({
    success: true,
    basket: req.session.basket,
  });
});

/* POST /api/basket/update */
router.post('/update', (req, res) => {
  const { productId = [], quantity = [] } = req.body;

  req.session.basket = req.session.basket
    .map(item => {
      const index = productId.indexOf(item.id);
      if (index !== -1) {
        const newQty = parseInt(quantity[index], 10);
        if (newQty > 0) {
          return { ...item, quantity: newQty };
        }
      }
      return item;
    })
    .filter(item => item.quantity > 0);

  res.json({
    basket: req.session.basket
  });
});

/* DELETE /api/basket/:id */
router.delete('/:id', (req, res) => {
  req.session.basket = req.session.basket.filter(
    item => item.id !== req.params.id
  );

  res.json({
    success: true,
    basket: req.session.basket,
  });
});

module.exports = router;
