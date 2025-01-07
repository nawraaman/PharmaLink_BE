const Pharmacy = require('../models/Pharmacy')
const express = require('express')
const router = express.Router()

// check role permissions
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied.' })
  }
  next()
}

// create a new pharmacy (admin only)
router.post('/', checkRole(['admin']), async (req, res) => {
  try {
    const newPharmacy = await Pharmacy.create(req.body)
    res.status(201).json(newPharmacy)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// get all pharmacies (all roles)
router.get(
  '/',
  checkRole(['admin', 'vendor', 'customer']),
  async (req, res) => {
    try {
      const pharmacies = await Pharmacy.find()
      res.status(200).json(pharmacies)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

// get pharmacy by Id (all roles)
router.get(
  '/:pharmacyId',
  checkRole(['admin', 'vendor', 'customer']),
  async (req, res) => {
    try {
      const pharmacy = await Pharmacy.findById(req.params.pharmacyId)
      if (!pharmacy) {
        return res.status(404).json({ error: 'Pharmacy not found.' })
      }
      res.status(200).json(pharmacy)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

// update pharmacy (admin: any, Vendor: only their own)
router.put('/:pharmacyId', checkRole(['admin', 'vendor']), async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.pharmacyId)
    if (!pharmacy) {
      return res.status(404).json({ error: 'Pharmacy not found.' })
    }

    // admins can edit any pharmacy
    if (req.user.role === 'admin') {
      const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
        req.params.pharmacyId,
        req.body,
        { new: true, runValidators: true }
      )
      return res.status(200).json(updatedPharmacy)
    }

    // vendors can only edit their own pharmacy
    if (
      req.user.role === 'vendor' &&
      pharmacy.userId.toString() === req.user._id
    ) {
      const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
        req.params.pharmacyId,
        req.body,
        { new: true, runValidators: true }
      )
      return res.status(200).json(updatedPharmacy)
    }

    // if not admin or authorized vendor
    return res.status(403).json({ error: 'Access denied.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// delete pharmacy (admin only)
router.delete('/:pharmacyId', checkRole(['admin']), async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.pharmacyId)
    if (!pharmacy) {
      return res.status(404).json({ error: 'Pharmacy not found.' })
    }
    await Pharmacy.findByIdAndDelete(req.params.pharmacyId)
    res.status(200).json({ message: 'Pharmacy deleted successfully.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
