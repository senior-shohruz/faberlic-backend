const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')

const DB_FILE = path.join(__dirname, 'data.json')

function initDB() {
  if (fs.existsSync(DB_FILE)) return

  const adminPass = bcrypt.hashSync('admin123', 10)
  const nargisaPass = bcrypt.hashSync('admin1984', 10)
  const now = new Date().toISOString()

  const data = {
    users: [
      { id: uuid(), name: 'Administrator', email: 'admin@faberlic.com', phone: '901234567', password: adminPass, role: 'admin', createdAt: now },
      { id: uuid(), name: 'Nargisa', email: 'admin@nargisa.com', phone: '900000000', password: nargisaPass, role: 'admin', createdAt: now },
      { id: uuid(), name: 'Ali Valiyev', email: 'ali@mail.com', phone: '901111111', password: bcrypt.hashSync('parol123', 10), role: 'user', createdAt: now },
      { id: uuid(), name: 'Malika Karimova', email: 'malika@mail.com', phone: '902222222', password: bcrypt.hashSync('parol123', 10), role: 'user', createdAt: now },
    ],
    products: [
      { id: uuid(), art: '8876', name: "Bubble White uzum ta'mli og'iz bo'shlig'ini chayish vositasi", category: 'Gigiena', oldPrice: 103000, price: 50900, discount: 51, emoji: '🫐', badges: ['Yangi mahsulot', 'Supernarx'], stock: 45, createdAt: now },
      { id: uuid(), art: '8879', name: "Bubble White malina ta'mli og'iz bo'shlig'ini soflantiruvchi vosita", category: 'Gigiena', oldPrice: 61900, price: 36900, discount: 40, emoji: '🍓', badges: ['Yangi mahsulot', 'Supernarx'], stock: 32, createdAt: now },
      { id: uuid(), art: '3887', name: '«Vizual oqartirish» Expert Pharma tish pastasi', category: 'Gigiena', oldPrice: 164000, price: 73900, discount: 55, emoji: '🦷', badges: ['Yangi mahsulot', 'Supernarx'], stock: 28, createdAt: now },
      { id: uuid(), art: '3569', name: "Umooo 3+ vanna uchun o'yinchoqli bolalar to'pchasi", category: 'Bolalar', oldPrice: 81900, price: 40900, discount: 50, emoji: '🧸', badges: ['Yangi mahsulot', 'Supernarx'], stock: 17, createdAt: now },
      { id: uuid(), art: '2211', name: 'Kollagen kremi 45+ yoshdan oshganlar uchun', category: 'Kosmetika', oldPrice: 185000, price: 92900, discount: 50, emoji: '✨', badges: ['Top sotuv'], stock: 15, createdAt: now },
      { id: uuid(), art: '2212', name: 'Aqua Series namlovchi yuz serumi 30 ml', category: 'Kosmetika', oldPrice: 95000, price: 52900, discount: 44, emoji: '💧', badges: ['Top sotuv'], stock: 40, createdAt: now },
      { id: uuid(), art: '2213', name: "Uy parfyumeriyasi lavanda va yo'lbars ko'zi", category: 'Parfyumeriya', oldPrice: 75000, price: 45900, discount: 39, emoji: '🌸', badges: ['Top sotuv'], stock: 22, createdAt: now },
      { id: uuid(), art: '3301', name: 'Yuz uchun krem-maska maksimal namlanish', category: 'Kosmetika', oldPrice: 220000, price: 79900, discount: 64, emoji: '🔥', badges: ['🔥 Olov narx'], stock: 8, createdAt: now },
      { id: uuid(), art: '4401', name: 'Omega-3 kapsulalari yurak uchun 60 dona', category: 'Salomatlik', oldPrice: 165000, price: 89900, discount: 45, emoji: '❤️', badges: ['Salomatlik'], stock: 50, createdAt: now },
      { id: uuid(), art: '4402', name: 'Vitamin D3 + K2 immunitet va suyak mustahkamligi', category: 'Salomatlik', oldPrice: 120000, price: 65900, discount: 45, emoji: '☀️', badges: ['Salomatlik'], stock: 33, createdAt: now },
    ],
    categories: [
      { id: uuid(), name: 'Kosmetika', icon: '💄', count: 120 },
      { id: uuid(), name: 'Parfyumeriya', icon: '🌸', count: 85 },
      { id: uuid(), name: 'Salomatlik', icon: '💊', count: 64 },
      { id: uuid(), name: 'Gigiena', icon: '🧼', count: 97 },
      { id: uuid(), name: 'Bolalar', icon: '🧸', count: 43 },
      { id: uuid(), name: "Uy-ro'zg'or", icon: '🏠', count: 38 },
    ],
    orders: [
      { id: uuid(), userId: 'u1', userName: 'Ali Valiyev', items: [{ name: "Bubble White uzum ta'mli", qty: 2, price: 50900 }], total: 101800, status: 'delivered', createdAt: now },
      { id: uuid(), userId: 'u2', userName: 'Malika Karimova', items: [{ name: 'Kollagen kremi', qty: 1, price: 92900 }, { name: 'Omega-3 kapsulalari', qty: 1, price: 89900 }], total: 182800, status: 'processing', createdAt: now },
      { id: uuid(), userId: 'u1', userName: 'Ali Valiyev', items: [{ name: 'Vitamin D3 + K2', qty: 3, price: 65900 }], total: 197700, status: 'pending', createdAt: now },
    ],
  }

  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
  console.log('✅ Database initialized: data.json')
}

function readDB() {
  initDB()
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

module.exports = { readDB, writeDB }
