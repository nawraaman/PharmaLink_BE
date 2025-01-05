const mongoose = require('mongoose')

const PharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  noBranches: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  logo: { type: String }
})

module.exports = mongoose.model('Pharmacy', PharmacySchema)
