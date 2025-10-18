import { useEffect, useState } from 'react'
import FilterNumbers from './components/FilterNumbers'
import FilterForm from './components/FilterForm'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import Info from './components/Info'
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

  // Send Notification
  const notify = (type, text) => {
    setMessage({
      type: type,
      text: text
    })
    setTimeout(() => {
      setMessage({ text: null })
    }, 3000)
  }

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
          notify('message', `Added ${added.name}`)

          setPersons(persons.concat(added))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          notify('error', `${error.response.data.error || error.message}`)
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
            notify('message', `${updated.name}'s number was changed`)

            setPersons(persons.map(person => 
              person.id === updated.id
                ? updated
                : person
            ))
          })
          .catch(error => {
            if (error.status === 404) {
              notify('error', `Information of ${newPerson.name} has already been removed from server`)

              setPersons(persons.filter(person =>
                person.id !== newPerson.id
              ))
              setNewName('')
              setNewNumber('')
            } else {
              const errorMessage = error.response.data.error || error.message
              console.log(errorMessage)
              notify('error', errorMessage)
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
        .catch(error => {
          if (error.status === 404) {
            notify('error', `Information of ${toBeDeleted.name} has already been removed from server`)

            setPersons(persons.filter(person =>
              person.id !== toBeDeleted.id
            ))
            setNewName('')
            setNewNumber('')
          } else {
              const errorMessage = error.response.data.error || error.message
              console.log(errorMessage)
              notify('error', errorMessage)
          }
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

      <Info url="/info" />
    </>
  )
}

export default App