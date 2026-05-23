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

const app = express()
const PORT = 5000

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/pickup-points', pickupPointRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`)
  console.log(`📋 Admin: admin@faberlic.com / admin123`)
})
