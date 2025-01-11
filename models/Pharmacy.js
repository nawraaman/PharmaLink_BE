const mongoose = require('mongoose')

const PharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  noBranches: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  logo: {
    type: String,
    default:
      'https://media.istockphoto.com/id/1275720974/vector/blue-and-green-medical-cross-health.jpg?s=612x612&w=0&k=20&c=j322qhLcySdh7qhtlTnUf_EUzlQG2i9bnoJ3vHdJ81I='
  }
})

module.exports = mongoose.model('Pharmacy', PharmacySchema)
