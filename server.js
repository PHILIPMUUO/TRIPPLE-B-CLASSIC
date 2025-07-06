const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');

app.use(cors());
app.use(express.json());

// Helper functions
const readProducts = () => {
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
};

const saveProducts = (products) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
};

// GET all products
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// GET product by ID
app.get('/api/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// ADD a new product
app.post('/api/products', (req, res) => {
  const products = readProducts();
  const newProduct = {
    ...req.body,
    _id: Date.now().toString() // simple ID
  };
  products.push(newProduct);
  saveProducts(products);
  res.status(201).json(newProduct);
});

// UPDATE product
app.put('/api/products/:id', (req, res) => {
  const products = readProducts();
  const updatedProducts = products.map(p =>
    p._id === req.params.id ? { ...p, ...req.body } : p
  );
  saveProducts(updatedProducts);
  res.json({ success: true, updated: req.body });
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const products = readProducts();
  const filtered = products.filter(p => p._id !== req.params.id);
  if (filtered.length === products.length) {
    return res.status(404).json({ error: 'Product not found' });
  }
  saveProducts(filtered);
  res.json({ success: true });
});

// Root
app.get('/', (req, res) => {
  res.send('Tripple B Fashion Backend is running...');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
