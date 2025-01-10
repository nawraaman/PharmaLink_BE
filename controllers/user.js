const User = require('../models/User')
const router = require('express').Router()
const { verifyToken } = require('../middleware/jwtUtils')

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    return res.status(201).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

router.get('/approvalrequests', async (req, res) => {
  try {
    const users = await User.find({ Approved: false })

    if (users.length === 0) {
      return res.status(404).json({ message: 'No approval requests found' })
    }

    return res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

router.put('/approve-user', async (req, res) => {
  const { username } = req.body

  try {
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update the 'Approved' field to true
    user.Approved = true
    await user.save()

    return res.status(200).json({ message: 'User approved successfully', user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

module.exports = router
