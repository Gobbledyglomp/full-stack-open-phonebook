const mongoose = require('mongoose')
const { Schema, model } = mongoose

// In case of <3 arguments
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

// Connect to the database
const password = process.argv[2]
const url = `mongodb+srv://mongodbatlasdiabetic738_db_user:${password}@cluster0.wbkkqd2.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)
mongoose.connect(url)

//
// Create person schema and model
//
const personSchema = new Schema({
    name: String,
    number: String
})

const Person = model('Person', personSchema)

// In case of 3 arguments
if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
// In case of >3 arguments
else {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}