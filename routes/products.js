const express = require('express')
const { v4: uuid } = require('uuid')
const { readDB, writeDB } = require('../db')
const { adminMiddleware } = require('../middleware/auth')

const router = express.Router()

router.get('/', (req, res) => res.json(readDB().products))

router.post('/', adminMiddleware, (req, res) => {
  const db = readDB()
  const product = { id: uuid(), ...req.body, createdAt: new Date().toISOString() }
  db.products.push(product)
  writeDB(db)
  res.status(201).json(product)
})

router.put('/:id', adminMiddleware, (req, res) => {
  const db = readDB()
  const idx = db.products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Mahsulot topilmadi' })
  db.products[idx] = { ...db.products[idx], ...req.body }
  writeDB(db)
  res.json(db.products[idx])
})

router.delete('/:id', adminMiddleware, (req, res) => {
  const db = readDB()
  db.products = db.products.filter(p => p.id !== req.params.id)
  writeDB(db)
  res.json({ ok: true })
})

module.exports = router
