const Numbers = ({ persons, onDelete }) => (
  <div>
      {persons.map(person =>
          <div key={person.name}>
              {person.name} {person.number}
              <button onClick={(e) => onDelete(e, person)}>Delete</button>
          </div>
      )}
  </div>
)

const FilterNumbers = ({ persons, filter, onDelete }) => (
  <Numbers 
    persons={persons.filter(person =>
      person
        .name
        .toLowerCase()
        .includes(filter.toLowerCase())
      )}
    onDelete={onDelete}
  />
)

export default FilterNumbers