function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${err.message}`)

  if (err.type === 'entity.too.large')
    return res.status(413).json({ error: 'So\'rov hajmi juda katta' })

  if (err.name === 'SyntaxError' && err.status === 400)
    return res.status(400).json({ error: 'JSON formatida xatolik' })

  const status = err.status || err.statusCode || 500
  const message = process.env.NODE_ENV === 'production'
    ? (status < 500 ? err.message : 'Ichki server xatoligi')
    : err.message

  res.status(status).json({ error: message })
}

function notFound(req, res) {
  res.status(404).json({ error: `${req.path} yo'l topilmadi` })
}

module.exports = { errorHandler, notFound }
