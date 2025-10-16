import Input from "./Input"

const FilterForm = ({ value, onChange }) => (
    <form>
        <Input 
            title="Filter shown with"
            value={value}
            onChange={onChange}
        />
    </form>
)

export default FilterForm