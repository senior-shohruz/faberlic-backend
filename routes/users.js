const express = require('express')
const { readDB, writeDB } = require('../db')
const { adminMiddleware } = require('../middleware/auth')

const router = express.Router()

router.get('/', adminMiddleware, (req, res) => {
  const users = readDB().users.map(({ password, ...u }) => u)
  res.json(users)
})

router.put('/:id/role', adminMiddleware, (req, res) => {
  const db = readDB()
  const idx = db.users.findIndex(u => u.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
  if (db.users[idx].role === 'admin' && req.user.id === req.params.id)
    return res.status(400).json({ error: "O'z roluingizni o'zgartira olmaysiz" })
  db.users[idx].role = req.body.role
  writeDB(db)
  const { password, ...user } = db.users[idx]
  res.json(user)
})

router.delete('/:id', adminMiddleware, (req, res) => {
  if (req.user.id === req.params.id) return res.status(400).json({ error: "O'zingizni o'chira olmaysiz" })
  const db = readDB()
  db.users = db.users.filter(u => u.id !== req.params.id)
  writeDB(db)
  res.json({ ok: true })
})

module.exports = router
