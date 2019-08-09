const express = require("express")
const app = express()

let contacts = [
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

app.get("/", (req, res) => {
	res.send("<h1>Hello World!</h1>")
})

app.get("/contacts", (req, res) => {
	res.json(contacts)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
