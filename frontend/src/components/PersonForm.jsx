import Input from "./Input"

const PersonForm = ({ onSubmit, name, number }) => (
    <form onSubmit={onSubmit}>
        <div>
            <Input
                title="Name"
                value={name.value}
                onChange={name.onChange}
            />
        </div>
        <div>
            <Input
                title="Number"
                value={number.value}
                onChange={number.onChange}
            />
        </div>
        <div>
            <button type="submit">Add</button>
        </div>
    </form>
)

export default PersonForm