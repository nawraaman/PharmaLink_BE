const express = require('express')
const Item = require('../models/Item')
const Pharmacy = require('../models/Pharmacy')
const router = express.Router()

// check role permissions
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied.' })
  }
  next()
}

// create a new item (admin and vendor)
router.post('/', checkRole(['admin', 'vendor']), async (req, res) => {
  try {
    if (req.user.role === 'vendor') {
      // vendors can only add items to their own pharmacy
      const pharmacy = await Pharmacy.findById(req.body.pharmacyId)
      if (!pharmacy || String(pharmacy.userId) !== req.user._id) {
        return res
          .status(403)
          .json({ error: 'Access denied to this pharmacy.' })
      }
    }

    const createItem = await Item.create(req.body)
    res.status(201).json(createItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// get all items (all roles)
router.get(
  '/',
  checkRole(['admin', 'vendor', 'customer']),
  async (req, res) => {
    try {
      let items

      if (req.user.role === 'admin' || req.user.role === 'customer') {
        items = await Item.find() // admin and customers can view all items
      } else if (req.user.role === 'vendor') {
        // vendors can only view items in their own pharmacies
        const pharmacies = await Pharmacy.find({ userId: req.user._id })
        const pharmacyIds = pharmacies.map((p) => p._id)
        items = await Item.find({ pharmacyId: { $in: pharmacyIds } }) //check the pharmacyId in the array
      }

      res.status(200).json(items)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

// get a single item by ID (all roles)
router.get(
  '/:itemId',
  checkRole(['admin', 'vendor', 'customer']),
  async (req, res) => {
    try {
      const item = await Item.findById(req.params.itemId)
      if (!item) {
        return res.status(404).json({ error: 'Item not found.' })
      }

      if (req.user.role === 'vendor') {
        // vendors can only view items in their own pharmacies
        const pharmacy = await Pharmacy.findById(item.pharmacyId)
        if (!pharmacy || String(pharmacy.userId) !== req.user._id) {
          return res.status(403).json({ error: 'Access denied to this item.' })
        }
      }

      res.status(200).json(item)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

// update an item (admin and vendor)
router.put('/:itemId', checkRole(['admin', 'vendor']), async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId)
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' })
    }

    if (req.user.role === 'vendor') {
      // vendors can only update items in their own pharmacies
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

// delete an item (admin and vendor)
router.delete('/:itemId', checkRole(['admin', 'vendor']), async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId)
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' })
    }

    if (req.user.role === 'vendor') {
      // vendors can only delete items in their own pharmacies
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
