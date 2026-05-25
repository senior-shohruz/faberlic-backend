function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone) {
  return /^[0-9]{9,12}$/.test(phone.replace(/[\s\-+]/g, ''))
}

function sanitize(str) {
  if (typeof str !== 'string') return str
  return str.trim().slice(0, 1000)
}

function validateLogin(req, res, next) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email va parol kerak' })
  if (!validateEmail(email)) return res.status(400).json({ error: "Email noto'g'ri formatda" })
  if (password.length < 6) return res.status(400).json({ error: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' })
  req.body.email = sanitize(email).toLowerCase()
  req.body.password = sanitize(password)
  next()
}

function validateRegister(req, res, next) {
  const { name, email, phone, password } = req.body
  if (!name || !email || !phone || !password)
    return res.status(400).json({ error: "Barcha maydonlar to'ldirilishi kerak" })
  if (name.length < 2 || name.length > 50)
    return res.status(400).json({ error: 'Ism 2-50 belgi orasida bo\'lishi kerak' })
  if (!validateEmail(email))
    return res.status(400).json({ error: "Email noto'g'ri formatda" })
  if (!validatePhone(phone))
    return res.status(400).json({ error: "Telefon raqam noto'g'ri formatda (9-12 raqam)" })
  if (password.length < 6)
    return res.status(400).json({ error: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' })
  req.body.name = sanitize(name)
  req.body.email = sanitize(email).toLowerCase()
  req.body.phone = sanitize(phone).replace(/[\s\-+]/g, '')
  req.body.password = sanitize(password)
  next()
}

function validateProduct(req, res, next) {
  const { name, price } = req.body
  if (!name || !price) return res.status(400).json({ error: 'Mahsulot nomi va narxi kerak' })
  if (typeof price !== 'number' || price <= 0)
    return res.status(400).json({ error: 'Narx musbat son bo\'lishi kerak' })
  next()
}

module.exports = { validateLogin, validateRegister, validateProduct, sanitize }
