require('dotenv').config()

const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const categoryRoutes = require('./routes/categories')
const userRoutes = require('./routes/users')
const orderRoutes = require('./routes/orders')
const statsRoutes = require('./routes/stats')
const bannerRoutes = require('./routes/banners')
const pickupPointRoutes = require('./routes/pickupPoints')
const { errorHandler, notFound } = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

// Security headers
try {
  const helmet = require('helmet')
  app.use(helmet({ crossOriginEmbedderPolicy: false }))
} catch {}

// Compression
try {
  const compression = require('compression')
  app.use(compression())
} catch {}

// Rate limiting
try {
  const rateLimit = require('express-rate-limit')
  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Juda ko\'p so\'rov. 15 daqiqadan keyin qayta urinib ko\'ring.' } })
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Juda ko\'p kirish urinishlari. 15 daqiqadan keyin qayta urinib ko\'ring.' } })
  app.use(limiter)
  app.use('/api/auth', authLimiter)
} catch {}

// CORS
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174,https://faberlic-website.vercel.app').split(',')
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) cb(null, true)
    else cb(new Error('CORS: ruxsat berilmagan manba'))
  },
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/pickup-points', pickupPointRoutes)

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  uptime: Math.floor(process.uptime()),
  timestamp: new Date().toISOString()
}))

// 404 & Error handlers
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`)
  console.log(`🔒 Mode: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📋 Admin: admin@faberlic.com / admin123`)
})
