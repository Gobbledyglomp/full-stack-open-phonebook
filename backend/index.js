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
const generateID = () => Math.ceil(
    Math.random() * 1000000000000000
)

app.post('/api/persons', (req, res) => {
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

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        id: `${generateID()}`,
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)

    res.status(201).json(person)
})

// DELETE
app.delete('/api/persons/:id', (req, res) => {
    const deleted = persons.find(person => person.id === req.params.id)
    persons = persons.filter(person => person.id !== deleted.id)

    res.status(204).end()
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
// Start listening to PORT
//
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})