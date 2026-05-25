const express = require('express')
const { v4: uuid } = require('uuid')
const { readDB, writeDB } = require('../db')
const { adminMiddleware } = require('../middleware/auth')
const { validateProduct } = require('../middleware/validate')

const router = express.Router()

// GET /api/products?search=&category=&sort=price_asc|price_desc|newest&page=1&limit=20&minPrice=&maxPrice=
router.get('/', (req, res) => {
  const db = readDB()
  let products = [...db.products]

  const { search, category, sort, page, limit, minPrice, maxPrice } = req.query

  if (search) {
    const q = search.toLowerCase()
    products = products.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.art?.toLowerCase().includes(q)
    )
  }

  if (category) {
    products = products.filter(p => p.category === category)
  }

  if (minPrice) products = products.filter(p => p.price >= Number(minPrice))
  if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice))

  switch (sort) {
    case 'price_asc':  products.sort((a, b) => a.price - b.price); break
    case 'price_desc': products.sort((a, b) => b.price - a.price); break
    case 'discount':   products.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break
    case 'newest':     products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
  }

  const total = products.length
  if (page || limit) {
    const p = Math.max(1, parseInt(page) || 1)
    const l = Math.min(100, Math.max(1, parseInt(limit) || 20))
    const sliced = products.slice((p - 1) * l, p * l)
    if (page) {
      return res.json({ data: sliced, total, page: p, limit: l, pages: Math.ceil(total / l) })
    }
    return res.json(sliced)
  }

  res.json(products)
})

router.get('/:id', (req, res) => {
  const product = readDB().products.find(p => p.id === req.params.id)
  if (!product) return res.status(404).json({ error: 'Mahsulot topilmadi' })
  res.json(product)
})

router.post('/', adminMiddleware, validateProduct, (req, res) => {
  const db = readDB()
  const product = {
    id: uuid(),
    ...req.body,
    stock: req.body.stock ?? 0,
    createdAt: new Date().toISOString()
  }
  db.products.push(product)
  writeDB(db)
  res.status(201).json(product)
})

router.put('/:id', adminMiddleware, (req, res) => {
  const db = readDB()
  const idx = db.products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Mahsulot topilmadi' })
  db.products[idx] = { ...db.products[idx], ...req.body, id: db.products[idx].id }
  writeDB(db)
  res.json(db.products[idx])
})

router.delete('/:id', adminMiddleware, (req, res) => {
  const db = readDB()
  const idx = db.products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Mahsulot topilmadi' })
  db.products.splice(idx, 1)
  writeDB(db)
  res.json({ ok: true })
})

module.exports = router
