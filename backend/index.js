require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

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

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            if (!result) {
                return response.status(404).end()
            }
            response.json(result)
        })
        .catch(error => next(error))
})

// POST
app.post('/api/persons', (request, response, next) => {
    const body = request.body

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

    Person.find({}).then(result => {
        response.send(`
            <p>Phonebook has info for ${result.length} people</p>
            <p>${now}</p>
            <i><a href="/">Back</a></i>
        `)
    })
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
  } if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
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