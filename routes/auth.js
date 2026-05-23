const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const { readDB, writeDB } = require('../db')
const { JWT_SECRET } = require('../middleware/auth')

const router = express.Router()

router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email va parol kerak' })
  const db = readDB()
  const user = db.users.find(u => u.email === email)
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: "Email yoki parol noto'g'ri" })
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET, { expiresIn: '7d' }
  )
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } })
})

router.post('/register', (req, res) => {
  const { name, email, phone, password } = req.body
  if (!name || !email || !phone || !password) return res.status(400).json({ error: "Barcha maydonlar to'ldirilishi kerak" })
  const db = readDB()
  if (db.users.find(u => u.email === email)) return res.status(400).json({ error: "Bu email allaqachon ro'yxatdan o'tgan" })
  if (db.users.find(u => u.phone === phone)) return res.status(400).json({ error: "Bu telefon raqam allaqachon ro'yxatdan o'tgan" })
  const user = { id: uuid(), name, email, phone, password: bcrypt.hashSync(password, 10), role: 'user', createdAt: new Date().toISOString() }
  db.users.push(user)
  writeDB(db)
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET, { expiresIn: '7d' }
  )
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } })
})

module.exports = router
