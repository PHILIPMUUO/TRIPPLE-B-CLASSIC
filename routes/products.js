const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/products.json');

// Read products
const getProducts = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Save products
const saveProducts = (products) => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
};

// GET all
router.get('/', (req, res) => {
  const products = getProducts();
  res.json(products);
});

// POST
router.post('/', (req, res) => {
  const products = getProducts();
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  saveProducts(products);
  res.status(201).json(newProduct);
});

// PUT
router.put('/:id', (req, res) => {
  const products = getProducts();
  const productId = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    saveProducts(products);
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// DELETE
router.delete('/:id', (req, res) => {
  const products = getProducts();
  const newProducts = products.filter(p => p.id !== parseInt(req.params.id));
  saveProducts(newProducts);
  res.json({ message: 'Deleted' });
});

module.exports = router;
