const mongoose = require("mongoose")

mongoose.set("useFindAndModify", false)

const url = `mongodb+srv://jacobherper:${process.env.MONGODB_PASSWORD}@cluster0-xbt7y.mongodb.net/phonebook?retryWrites=true&w=majority`

console.log("connecting to", url)

mongoose
	.connect(url, { useNewUrlParser: true })
	.then(res => {
		console.log("connected to MongoDB")
	})
	.catch(err => {
		console.log("error connecting to MongoDB:", err.message)
	})

const personsSchema = new mongoose.Schema({
	name: String,
	number: String,
})

personsSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model("Person", personsSchema)
