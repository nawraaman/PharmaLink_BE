const express = require('express')
const Pharmacy = require('../models/Pharmacy')
const User = require('../models/User')
const multer = require('multer')
const { verifyToken } = require('../middleware/jwtUtils')
const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/logos')
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

// // Create pharmacy (vendors only, and must be approved)
// router.post('/', verifyToken, upload.single('logo'), async (req, res) => {
//   try {

//     if (req.user.role !== 'Vendor') {
//       return res
//         .status(403)
//         .json({ error: 'Only vendors can create pharmacies.' })
//     }

//     const user = await User.findById(req.user._id)

//     // console.log(user)

//     if (!user || !user.Approved) {
//       return res
//         .status(403)
//         .json({ error: 'You are not approved to create a pharmacy.' })
//     }

//     req.body.userId = req.user._id

//     req.body.logo = `/uploads/logos/${req.file.filename}`

//     console.log(req.body)

//     const newPharmacy = await Pharmacy.create(req.body)
//     res.status(201).json(newPharmacy)
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// })

// Create pharmacy (vendors only, and must be approved)
//this one is working but without logo
// router.post('/', verifyToken, async (req, res) => {
//   try {
//     if (req.user.role !== 'Vendor') {
//       return res
//         .status(403)
//         .json({ error: 'Only vendors can create pharmacies.' })
//     }

//     const user = await User.findById(req.user._id)

//     // console.log(user)

//     if (!user || !user.Approved) {
//       return res
//         .status(403)
//         .json({ error: 'You are not approved to create a pharmacy.' })
//     }

//     req.body.userId = req.user._id

//     console.log(req.body)

//     const newPharmacy = await Pharmacy.create(req.body)
//     res.status(201).json(newPharmacy)
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// })

// Get all pharmacies (all roles)
router.get('/', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find()
    res.status(200).json(pharmacies)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get pharmacy by ID (all roles)
router.get('/:pharmacyId', async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.pharmacyId)
    if (!pharmacy) {
      return res.status(404).json({ error: 'Pharmacy not found.' })
    }
    res.status(200).json(pharmacy)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update pharmacy (admin: any, vendor: only their own)
router.put('/:pharmacyId', async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.pharmacyId)
    if (!pharmacy) {
      return res.status(404).json({ error: 'Pharmacy not found.' })
    }

    if (
      req.user.role === 'Admin' ||
      (req.user.role === 'Vendor' &&
        pharmacy.userId.toString() === req.user._id)
    ) {
      const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
        req.params.pharmacyId,
        req.body,
        { new: true, runValidators: true }
      )
      return res.status(200).json(updatedPharmacy)
    }

    return res.status(403).json({ error: 'Access denied.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete pharmacy (admin only)
router.delete('/:pharmacyId', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied.' })
    }

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
