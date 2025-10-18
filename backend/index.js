require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

// Data
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


//
// Middleware
//
morgan.token('body', req => JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


//
// Persons API
//

// GET
app.get('/api/persons', (req, res) => {
    Person.find({}).then(response => {
        res.json(response)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).json({
            error: `Person ${id} was not found`
        })
    }
})

// POST
app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'Name is missing'
        })
    }
    
    if (!body.number) {
        return res.status(400).json({
            error: 'Number is missing'
        })
    }

    const person = new Person(body)

    person.save().then(result => {
        res.status(201).json(result)
    })
    .catch(error => next(error))
})

// DELETE
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            if (!result) {
                return res.status(404).end()
            }            
            res.status(204).end()
        })
        .catch(error => next(error))
})

//
// Info
//
app.get('/info', (req, res) => {
    const now = new Date()

    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${now}</p>
    `)
})


//
// Middleware
//

// Unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Error handler
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)


//
// Start listening to PORT
//
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})