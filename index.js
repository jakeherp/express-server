const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")

let persons = [
	{
		name: "Arto Hellas",
		number: "040-123456",
		id: 1,
	},
	{
		name: "Ada Lovelace",
		number: "39-44-5323523",
		id: 2,
	},
	{
		name: "Dan Abramov",
		number: "12-43-234345",
		id: 3,
	},
]

app.use(bodyParser.json())
app.use(morgan(":method :url - :body"))

morgan.token("body", (req, res) => {
	return JSON.stringify(req.body)
})

app.get("/info", (req, res) => {
	res.send(`
		<p>Phonebook has info for ${persons.length} people xxx</p>
		<p>${new Date()}</p>
	`)
})

app.get("/api/persons", (req, res) => {
	res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(person => person.id === id)

	person ? res.json(person) : res.status(404).end()
})

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)
	res.status(204).end()
})

const generateRandomId = () => {
	return Math.floor(Math.random() * Math.floor(1000000))
}

app.post("/api/persons", (req, res) => {
	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: "content is missing",
		})
	}

	const checkDuplicate = persons.filter(person => person.name === body.name)

	if (checkDuplicate.length > 0) {
		return res.status(400).json({
			error: "name must be unique",
		})
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateRandomId(),
	}

	persons = persons.concat(person)

	res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
