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
morgan.token('body', request => JSON.stringify(request.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


//
// Persons API
//

// GET
app.get('/api/persons', (_request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).json({
            error: `Person ${id} was not found`
        })
    }
})

// POST
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'Name is missing'
        })
    }
    
    if (!body.number) {
        return response.status(400).json({
            error: 'Number is missing'
        })
    }

    const person = new Person(body)

    person.save().then(result => {
        response.status(201).json(result)
    })
    .catch(error => next(error))
})

// PUT
app.put('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            if (!result) {
                return response.status(404).end()
            }

            result.name = request.body.name
            result.number = request.body.number

            return result.save()
        })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

// DELETE
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            if (!result) {
                return response.status(404).end()
            }            
            response.status(204).end()
        })
        .catch(error => next(error))
})

//
// Info
//
app.get('/info', (_request, response) => {
    const now = new Date()

    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${now}</p>
    `)
})


//
// Middleware
//

// Unknown endpoint
const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Error handler
const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
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