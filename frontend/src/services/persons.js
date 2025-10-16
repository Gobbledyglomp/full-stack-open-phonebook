import axios from "axios"
const url = 'http://localhost:3001/api/persons'

const get = () => axios
    .get(url)
    .then(res => res.data)
    
const create = newPerson => axios
    .post(url, newPerson)
    .then(res => res.data)

const update = newPerson => axios
    .put(`${url}/${newPerson.id}`, newPerson)
    .then(res => res.data)

const remove = person => axios
    .delete(`${url}/${person.id}`)

export default { get, create, remove, update }