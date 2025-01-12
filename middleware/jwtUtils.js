const jwt = require('jsonwebtoken')

const signToken = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET
  )
  return token
}

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Token missing.' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = {
      _id: decoded._id,
      role: decoded.role
    }

    next()
  } catch (error) {
    console.error('Token Error:', error)
    res.status(401).json({ error: 'Invalid or missing token.' })
  }
}

module.exports = {
  signToken,
  verifyToken
}
