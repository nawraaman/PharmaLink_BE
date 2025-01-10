const express = require('express')
const Item = require('../models/Item')
const Pharmacy = require('../models/Pharmacy')
const multer = require('multer')
const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/items')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'))
  }
}

const upload = multer({ storage, fileFilter })

// Create a new item(admin & vendor)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'vendor') {
      return res.status(403).json({ error: 'Access denied.' })
    }

    if (req.user.role === 'vendor') {
      const pharmacy = await Pharmacy.findById(req.body.pharmacyId)
      if (!pharmacy || String(pharmacy.userId) !== req.user._id) {
        return res
          .status(403)
          .json({ error: 'Access denied to this pharmacy.' })
      }
    }

    req.body.image = `/uploads/items/${req.file.filename}`
    const newItem = await Item.create(req.body)
    res.status(201).json(newItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all items (all roles)
router.get('/', async (req, res) => {
  try {
    const items = await Item.find()
    res.status(200).json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get a single item by ID (all roles)
router.get('/:itemId', async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId)
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' })
    }

    if (req.user.role === 'vendor') {
      const pharmacy = await Pharmacy.findById(item.pharmacyId)
      if (!pharmacy || String(pharmacy.userId) !== req.user._id) {
        return res.status(403).json({ error: 'Access denied to this item.' })
      }
    }

    res.status(200).json(item)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update an item (admin and vendor)
router.put('/:itemId', async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId)
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' })
    }

    if (req.user.role === 'vendor') {
      const pharmacy = await Pharmacy.findById(item.pharmacyId)
      if (!pharmacy || String(pharmacy.userId) !== req.user._id) {
        return res.status(403).json({ error: 'Access denied to this item.' })
      }
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.itemId,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete an item (admin and vendor)
router.delete('/:itemId', async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId)
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' })
    }

    if (req.user.role === 'vendor') {
      const pharmacy = await Pharmacy.findById(item.pharmacyId)
      if (!pharmacy || String(pharmacy.userId) !== req.user._id) {
        return res.status(403).json({ error: 'Access denied to this item.' })
      }
    }

    const deletedItem = await Item.findByIdAndDelete(req.params.itemId)
    res.status(200).json(deletedItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
