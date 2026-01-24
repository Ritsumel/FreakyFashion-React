const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const adminRouter = require('./routes/admin');
const productsRouter = require('./routes/products');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
}));

/* ===== Middleware ===== */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

/* ===== Static files (ONLY for uploaded images) ===== */
app.use('/images', express.static(path.join(__dirname, 'public/images')));

/* ===== Routes ===== */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/admin', adminRouter);
app.use('/admin/products', productsRouter);

/* ===== Start server ===== */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
