const express = require('express')
const { v4: uuid } = require('uuid')
const { readDB, writeDB } = require('../db')
const { adminMiddleware } = require('../middleware/auth')

const router = express.Router()

const DEFAULT_POINTS = [
  {
    id: uuid(),
    name: "Chilonzor filiali",
    address: "Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi 5-uy",
    phone: "+998 71 123-45-67",
    hours: "Du–Sha: 09:00–20:00",
    landmark: "Metro Chilonzordan 3 daqiqa yurish",
    emoji: "🏪",
    active: true,
  },
  {
    id: uuid(),
    name: "Yunusobod filiali",
    address: "Toshkent sh., Yunusobod tumani, Amir Temur shoh ko'chasi 108-uy",
    phone: "+998 71 234-56-78",
    hours: "Du–Sha: 09:00–21:00, Yak: 10:00–18:00",
    landmark: "Yunusobod savdo markaziga yaqin",
    emoji: "🏬",
    active: true,
  },
]

function ensurePickupPoints(db) {
  if (!db.pickupPoints || db.pickupPoints.length === 0) {
    db.pickupPoints = DEFAULT_POINTS.map(p => ({
      ...p,
      id: uuid(),
      createdAt: new Date().toISOString(),
    }))
    writeDB(db)
  }
  return db
}

router.get('/', (req, res) => {
  const db = ensurePickupPoints(readDB())
  res.json(db.pickupPoints)
})

router.post('/', adminMiddleware, (req, res) => {
  const db = ensurePickupPoints(readDB())
  const point = { id: uuid(), ...req.body, active: true, createdAt: new Date().toISOString() }
  db.pickupPoints.push(point)
  writeDB(db)
  res.status(201).json(point)
})

router.put('/:id', adminMiddleware, (req, res) => {
  const db = ensurePickupPoints(readDB())
  const idx = db.pickupPoints.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Punkt topilmadi' })
  db.pickupPoints[idx] = { ...db.pickupPoints[idx], ...req.body }
  writeDB(db)
  res.json(db.pickupPoints[idx])
})

router.delete('/:id', adminMiddleware, (req, res) => {
  const db = ensurePickupPoints(readDB())
  db.pickupPoints = db.pickupPoints.filter(p => p.id !== req.params.id)
  writeDB(db)
  res.json({ ok: true })
})

module.exports = router
