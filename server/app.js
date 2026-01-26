const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const adminRouter = require('./routes/admin/admin');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const basketRouter = require('./routes/basket');
const checkoutRouter = require('./routes/checkout');
const confirmationApiRouter = require('./routes/api/confirmation');


const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

/* ===== Middleware ===== */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,      // must be false on localhost
    sameSite: 'lax',    // important for cross-origin dev
  }
}));

/* ===== Static files (ONLY for uploaded images) ===== */
app.use('/images', express.static(path.join(__dirname, 'public/images')));

/* ===== Routes ===== */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/admin', adminRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/products', productsRouter);
app.use('/api/basket', basketRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/confirmation', confirmationApiRouter);

/* ===== Start server ===== */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
