const mongoose = require('mongoose')

// Connect to the database
const url = process.env.MONGODB_URI
mongoose.set('strictQuery',false)
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log(`Error connecting to MongoDB: ${error}`)
    })

//
// Schema
//
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        validate: {
            validator: function(number) {
                return /^\d{2,3}-\d+$/.test(number)
            },
            message: () => 'Phone number must be in correct form'
        },
        minLength: [8, 'Phone number must have length of 8 or more'],
        required: [true, 'Phone number required']
    }
})

personSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        return {
            id: returnedObject._id,
            name: returnedObject.name,
            number: returnedObject.number
        }
    }
})

//
// Export Model
//
module.exports = mongoose.model('Person', personSchema)