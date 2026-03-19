const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Define schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long'], // minLength validator
    required: [true, 'Name is required'], // required validator
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        const parts = v.split('-')
        if (parts.length !== 2) return false

        const [first, second] = parts
        if (!/^\d{2,3}$/.test(first)) return false
        if (!/^\d{5,}$/.test(second)) return false

        return true
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'Number is required'],
  },
})

// Transform _id → id and remove __v
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
