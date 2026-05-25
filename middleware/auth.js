const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'faberlic_jwt_secret_2025'

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token kerak' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Token muddati tugagan. Qayta kiring.'
      : "Token noto'g'ri"
    res.status(401).json({ error: msg })
  }
}

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token kerak' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin huquqi kerak' })
    next()
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Token muddati tugagan. Qayta kiring.'
      : "Token noto'g'ri"
    res.status(401).json({ error: msg })
  }
}

module.exports = { authMiddleware, adminMiddleware, JWT_SECRET }
