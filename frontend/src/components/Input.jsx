const Input = ({ title, value, onChange }) => (
    <div>
        {title}: <input 
            value={value}
            onChange={onChange}
        />
    </div>
)

export default Input