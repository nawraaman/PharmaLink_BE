const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  pharmacyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  expireDate: { type: Date, required: true },
  description: { type: String },
  category: { type: String, required: true },
  image: { type: String }
})

module.exports = mongoose.model('Item', ItemSchema)
