const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')

const DB_FILE = path.join(__dirname, 'data.json')

if (!fs.existsSync(DB_FILE)) {
  console.log('data.json topilmadi. Avval serverni ishga tushiring.')
  process.exit(1)
}

const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))

const exists = db.users.find(u => u.email === 'admin@nargisa.com')
if (exists) {
  exists.password = bcrypt.hashSync('admin1984', 10)
  exists.role = 'admin'
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
  console.log('✅ admin@nargisa.com paroli yangilandi.')
} else {
  db.users.push({
    id: uuid(),
    name: 'Nargisa',
    email: 'admin@nargisa.com',
    phone: '900000000',
    password: bcrypt.hashSync('admin1984', 10),
    role: 'admin',
    createdAt: new Date().toISOString()
  })
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
  console.log('✅ admin@nargisa.com qoshildi.')
}
