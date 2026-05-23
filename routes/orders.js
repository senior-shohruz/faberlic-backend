const express = require('express')
const { v4: uuid } = require('uuid')
const { readDB, writeDB } = require('../db')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')

const router = express.Router()

router.get('/', adminMiddleware, (req, res) => res.json(readDB().orders))

router.get('/my', authMiddleware, (req, res) => {
  const db = readDB()
  const myOrders = db.orders
    .filter(o => o.userId === req.user.id)
    .reverse()
  res.json(myOrders)
})

router.post('/', authMiddleware, (req, res) => {
  const db = readDB()
  const order = {
    id: uuid(),
    userId: req.user.id,
    userName: req.user.name,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  db.orders.push(order)

  // Decrement stock for each ordered item
  if (Array.isArray(req.body.items)) {
    req.body.items.forEach(item => {
      const product = db.products.find(p => p.id === item.id)
      if (product && typeof product.stock === 'number') {
        product.stock = Math.max(0, product.stock - (item.qty || 1))
      }
    })
  }

  writeDB(db)
  res.status(201).json(order)
})

router.put('/:id/status', adminMiddleware, (req, res) => {
  const db = readDB()
  const idx = db.orders.findIndex(o => o.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Buyurtma topilmadi' })
  db.orders[idx].status = req.body.status
  writeDB(db)
  res.json(db.orders[idx])
})

router.delete('/:id', adminMiddleware, (req, res) => {
  const db = readDB()
  db.orders = db.orders.filter(o => o.id !== req.params.id)
  writeDB(db)
  res.json({ ok: true })
})

module.exports = router
