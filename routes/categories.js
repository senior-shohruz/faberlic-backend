const express = require('express')
const { v4: uuid } = require('uuid')
const { readDB, writeDB } = require('../db')
const { adminMiddleware } = require('../middleware/auth')

const router = express.Router()

router.get('/', (req, res) => res.json(readDB().categories))

router.post('/', adminMiddleware, (req, res) => {
  const db = readDB()
  const cat = { id: uuid(), ...req.body }
  db.categories.push(cat)
  writeDB(db)
  res.status(201).json(cat)
})

router.put('/:id', adminMiddleware, (req, res) => {
  const db = readDB()
  const idx = db.categories.findIndex(c => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Kategoriya topilmadi' })
  db.categories[idx] = { ...db.categories[idx], ...req.body }
  writeDB(db)
  res.json(db.categories[idx])
})

router.delete('/:id', adminMiddleware, (req, res) => {
  const db = readDB()
  db.categories = db.categories.filter(c => c.id !== req.params.id)
  writeDB(db)
  res.json({ ok: true })
})

module.exports = router
