const express = require('express')
const Item = require('../models/Item')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const createItem = await Item.create(req.body)
    res.status(201).json(createItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const foundItems = await Item.find()
    res.status(200).json(foundItems) // 200 OK
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:itemId', async (req, res) => {
  try {
    const foundItems = await Item.findById(req.params.itemId)
    if (!foundItems) {
      res.status(404)
      throw new Error('Item not found.')
    }
    res.status(200).json(foundItems)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
})

router.put('/:itemId', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.itemId,
      req.body,
      {
        new: true
      }
    )
    if (!updatedItem) {
      res.status(404)
      throw new Error('Item not found.')
    }
    res.status(200).json(updatedItem)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({ error: error.message })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
})

router.delete('/:itemId', async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.itemId)
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
