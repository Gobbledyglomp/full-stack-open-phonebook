import { useEffect, useState } from 'react'
import FilterNumbers from './components/FilterNumbers'
import FilterForm from './components/FilterForm'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  //
  // State hooks
  //
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState({ text: null })

  //
  // Effect hook
  //
  useEffect(() => {
    personService
      .get()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  //
  // Functions
  //
  const handleNameInput = event => setNewName(event.target.value)
  const handleNumberInput = event => setNewNumber(event.target.value)
  const handleFilterInput = event => setNewFilter(event.target.value)

  // Handle adding a person
  const handleSubmit = event => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber
    }

    const duplicate = persons.find(person => person.name === newName)
    // If there is no duplicate
    if (duplicate === undefined) {
      personService
        .create(newPerson)
        .then(added => {
          setMessage({
            text: `Added ${added.name}`,
            type: 'message'
          })
          setTimeout(() => {
            setMessage({ text: null })
          }, 3000)

          setPersons(persons.concat(added))
          setNewName('')
          setNewNumber('')
        })
    } 
    // If there is duplicate
    else {
      const canChange = confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (canChange) {
        newPerson.id = duplicate.id

        personService
          .update(newPerson)
          .then(updated => {
            setMessage({
              text: `${updated.name}'s number was changed`,
              type: 'message'
            })
            setTimeout(() => {
              setMessage({ text: null })
            }, 3000)

            setPersons(persons.map(person => 
              person.id === updated.id
                ? updated
                : person
            ))
          })
          .catch(error => {
            if (error.status === 404) {
              setMessage({
                text: `Information of ${newPerson.name} has already been removed from server`,
                type: 'error'
              })
              setTimeout(() => {
                setMessage({ text: null })
              }, 3000)

              setPersons(persons.filter(person =>
                person.id !== newPerson.id
              ))
              setNewName('')
              setNewNumber('')
            } else {
              throw error
            }
          })
      }
    }
  }

  // Handle deletion of a person
  const handleDeletion = (event, toBeDeleted) => {
    event.preventDefault()

    const canDelete = confirm(`Delete ${toBeDeleted.name}?`)
    if (canDelete) {
      personService
        .remove(toBeDeleted)
        .then(() => {
          setPersons(persons.filter(person => person.id !== toBeDeleted.id))
        })
    }
  }

  //
  // Return
  //
  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <FilterForm
        value={newFilter} 
        onChange={handleFilterInput} 
      />

      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={handleSubmit}
        name={{ value: newName, onChange: handleNameInput }}
        number={{ value: newNumber, onChange: handleNumberInput }}
      />

      <h3>Numbers</h3>
      <FilterNumbers
        persons={persons}
        filter={newFilter}
        onDelete={handleDeletion}
      />
    </>
  )
}

export default App