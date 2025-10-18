const Numbers = ({ persons, onDelete }) => (
    <table>
      <tbody>
          {persons.map(person =>
              <tr key={person.id}>                
                  <td style={{'width': '115px'}}> 
                      <label>{person.name}</label>
                  </td>                
                  <td style={{'width': '115px'}}> 
                      <label>{person.number}</label>
                  </td>
                  <td>
                      <button onClick={(e) => onDelete(e, person)}>Delete</button>
                  </td>              
              </tr>
          )}
      </tbody>
  </table>
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