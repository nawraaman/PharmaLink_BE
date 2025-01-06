const Pharmacy = require('..models/Pharmacy')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const createPharmacy = await Pharmacy.create(req.body)
    res.status(201).json(createPharmacy)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const foundPharmacies = await Pharmacy.find()
    res.status(200).json(foundPharmacies) // 200 OK
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:pharmacyId', async (req, res) => {
  try {
    const foundPharmacies = await Pharmacy.findById(req.params.pharmacyId)
    if (!foundPharmacies) {
      res.status(404)
      throw new Error('Pharmacy not found.')
    }
    res.status(200).json(foundPharmacies)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
})

router.put('/:pharmacyId', async (req, res) => {
  try {
    const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.pharmacyId,
      req.body,
      {
        new: true
      }
    )
    if (!updatedPharmacy) {
      res.status(404)
      throw new Error('Pharmacy not found.')
    }
    res.status(200).json(updatedPharmacy)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
})

router.delete('/:pharmacyId', async (req, res) => {
  try {
    const deleted = await Pharmacy.findByIdAndDelete(req.params.pharmacyId)
    res.status(200).json(deleted)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
})

module.exports = router
