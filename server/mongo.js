require("dotenv").config()
const mongoose = require("mongoose")

if (process.argv.length < 3) {
	console.log("give password as argument")
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://jacobherper:${password}@cluster0-xbt7y.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personsSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model("Person", personsSchema)

const person = new Person({
	name: process.argv[3],
	number: process.argv[4],
})

if (process.argv[3] === undefined || process.argv[3] === undefined) {
	Person.find({}).then(res => {
		res.forEach(person => {
			console.log(person)
		})
		mongoose.connection.close()
	})
} else {
	person.save().then(res => {
		console.log(
			`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`,
		)
		mongoose.connection.close()
	})
}
