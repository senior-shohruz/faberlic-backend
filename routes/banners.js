const express = require('express')
const { v4: uuid } = require('uuid')
const { readDB, writeDB } = require('../db')
const { adminMiddleware } = require('../middleware/auth')

const router = express.Router()

router.get('/', (req, res) => {
  const db = readDB()
  const banners = (db.banners || []).filter(b => b.active)
  res.json(banners)
})

router.get('/all', adminMiddleware, (req, res) => {
  const db = readDB()
  res.json(db.banners || [])
})

router.post('/', adminMiddleware, (req, res) => {
  const db = readDB()
  if (!db.banners) db.banners = []
  const banner = { id: uuid(), ...req.body, active: req.body.active ?? true, createdAt: new Date().toISOString() }
  db.banners.push(banner)
  writeDB(db)
  res.status(201).json(banner)
})

router.put('/:id', adminMiddleware, (req, res) => {
  const db = readDB()
  if (!db.banners) db.banners = []
  const idx = db.banners.findIndex(b => b.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Banner topilmadi' })
  db.banners[idx] = { ...db.banners[idx], ...req.body }
  writeDB(db)
  res.json(db.banners[idx])
})

router.delete('/:id', adminMiddleware, (req, res) => {
  const db = readDB()
  db.banners = (db.banners || []).filter(b => b.id !== req.params.id)
  writeDB(db)
  res.json({ ok: true })
})

module.exports = router
