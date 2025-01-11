const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      default: 'Vendor'
    },
    Approved: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
)
userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    delete returnedObj._id
    delete returnedObj.__v
  }
})
const User = mongoose.model('User', userSchema)
module.exports = User
