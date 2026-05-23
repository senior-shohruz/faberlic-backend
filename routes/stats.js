const express = require('express')
const { readDB } = require('../db')
const { adminMiddleware } = require('../middleware/auth')

const router = express.Router()

router.get('/', adminMiddleware, (req, res) => {
  const db = readDB()

  const revenue = db.orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const lowStock = db.products.filter(p => p.stock < 10)

  const statusCounts = db.orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})

  // Revenue by last 7 days
  const now = Date.now()
  const dayMs = 86400000
  const revenueByDay = Array.from({ length: 7 }, (_, i) => {
    const dayStart = now - (6 - i) * dayMs
    const dayEnd = dayStart + dayMs
    const label = new Date(dayStart).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })
    const amount = db.orders
      .filter(o => {
        const t = new Date(o.createdAt).getTime()
        return t >= dayStart && t < dayEnd
      })
      .reduce((s, o) => s + (o.total || 0), 0)
    return { label, amount }
  })

  // Top products by order frequency
  const productFreq = {}
  db.orders.forEach(o => {
    o.items?.forEach(it => {
      const key = it.name || it.id
      productFreq[key] = (productFreq[key] || 0) + (it.qty || 1)
    })
  })
  const topProducts = Object.entries(productFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name, qty }))

  // Today's orders & revenue
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayOrders = db.orders.filter(o => new Date(o.createdAt) >= todayStart)
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0)

  res.json({
    totalProducts: db.products.length,
    totalUsers: db.users.filter(u => u.role === 'user').length,
    totalOrders: db.orders.length,
    revenue,
    todayOrders: todayOrders.length,
    todayRevenue,
    lowStock,
    statusCounts,
    recentOrders: [...db.orders].reverse().slice(0, 8),
    revenueByDay,
    topProducts,
  })
})

module.exports = router
