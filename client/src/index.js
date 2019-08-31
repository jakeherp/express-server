import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import personsService from "./services/persons"

import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState("")
	const [newNumber, setNewNumber] = useState("")
	const [filterName, setFilterName] = useState("")

	useEffect(() => {
		personsService.getPersons().then(res => {
			setPersons(res.data)
		})
	}, [])

	const handleNameChange = e => setNewName(e.target.value)

	const handleNumberChange = e => setNewNumber(e.target.value)

	const handleFilter = e => setFilterName(e.target.value)

	const filteredContacts = !filterName
		? persons
		: persons.filter(person => person.name.includes(filterName))

	const resetForm = () => {
		setNewName("")
		setNewNumber("")
	}

	const addPerson = e => {
		e.preventDefault()

		const contacts = [...persons]
		const res = contacts.find(person => person.name === newName)

		if (res) {
			const confirm = window.confirm(
				`${newName} is already added to phonebook, replace the old number with a new one?`,
			)
			confirm &&
				personsService
					.updatePerson(res.id, { ...res, number: newNumber })
					.then(updatedPerson => {
						const updatedPersons = persons.map(person =>
							person.id === updatedPerson.id
								? updatedPerson
								: person,
						)
						setPersons(updatedPersons)
						resetForm()
					})
		} else if (newName && newNumber) {
			personsService
				.createPerson({
					name: newName,
					number: newNumber,
					id: persons.length + 1,
				})
				.then(res => {
					setPersons([...persons, res.data])
				})
				.catch(err => {
					console.log(err.response.data)
				})
			resetForm()
		}
	}

	const removePerson = id => {
		personsService.removePerson(id).then(() => {
			const updatedPersons = persons.filter(person => person.id !== id)
			setPersons(updatedPersons)
		})
	}

	return (
		<div>
			<h1>Phonebook</h1>
			<Filter value={{ filterName }} handler={{ handleFilter }} />
			<h2>Add a new contact</h2>
			<PersonForm
				values={{ newName, newNumber }}
				handlers={{
					handleNameChange,
					handleNumberChange,
					addPerson,
				}}
			/>
			<h2>Numbers</h2>
			<Persons persons={filteredContacts} removePerson={removePerson} />
		</div>
	)
}

export default App

ReactDOM.render(<App />, document.getElementById("root"))
