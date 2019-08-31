require("dotenv").config()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")

const Person = require("./models/person")

app.use(bodyParser.json())
app.use(morgan(":method :url - :body"))
app.use(cors())
app.use(express.static("build"))

morgan.token("body", (req, res) => {
	return JSON.stringify(req.body)
})

app.get("/info", (req, res) => {
	Person.find({}).then(persons => {
		res.send(`
			<p>Phonebook has info for ${persons.length} people</p>
			<p>${new Date()}</p>
		`)
	})
})

app.get("/api/persons", (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons.map(person => person.toJSON()))
	})
})

app.get("/api/persons/:id", (req, res, next) => {
	Person.findById(req.params.id)
		.then(person => {
			if (person) {
				res.json(person.toJSON())
			} else {
				res.status(404).end()
			}
		})
		.catch(err => next(err))
})

app.put("/api/persons/:id", (req, res, next) => {
	const body = req.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then(updatedPerson => {
			res.json(updatedPerson.toJSON())
		})
		.catch(err => next(err))
})

app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(res => {
			res.status(204).end()
		})
		.catch(err => next(err))
})

app.post("/api/persons", (req, res) => {
	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json({ error: "content missing" })
	}

	const checkDuplicate = Person.find({ name: body.name }).then(res => {
		res, mongoose.connection.close()
	})

	if (checkDuplicate.length > 0) {
		return res.status(400).json({
			error: "name must be unique",
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedPerson => {
		res.json(savedPerson.toJSON())
	})
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
	console.error(err.message)

	if (err.name === "CastError" && err.kind === "ObjectId") {
		return res.status(400).send({ error: "malformatted id" })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
