import React from "react"

const Persons = ({ persons, removePerson }) => {
	const confirm = (id, name) => {
		window.confirm(`Delete ${name}?`) && removePerson(id, name)
		return
	}
	return (
		<ul>
			{persons.map(person => (
				<li key={person.name}>
					<span>
						{person.name} - {person.number}{" "}
					</span>
					<button onClick={() => confirm(person.id, person.name)}>
						delete
					</button>
				</li>
			))}
		</ul>
	)
}

export default Persons
