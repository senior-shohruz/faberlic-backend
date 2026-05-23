const jwt = require('jsonwebtoken')
const JWT_SECRET = 'faberlic_jwt_secret_2025'

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token kerak' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: "Token noto'g'ri yoki muddati tugagan" })
  }
}

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token kerak' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin huquqi kerak' })
    next()
  } catch {
    res.status(401).json({ error: "Token noto'g'ri" })
  }
}

module.exports = { authMiddleware, adminMiddleware, JWT_SECRET }
