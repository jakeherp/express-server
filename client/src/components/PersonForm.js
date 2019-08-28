import React from "react"

const Form = ({
	handlers: { handleNameChange, handleNumberChange, addPerson },
	values: { newName, newNumber },
}) => (
	<form onSubmit={addPerson}>
		<div>
			name: <input value={newName} onChange={handleNameChange} />
			number:{" "}
			<input type="tel" value={newNumber} onChange={handleNumberChange} />
		</div>
		<div>
			<button type="submit">add</button>
		</div>
	</form>
)

export default Form
