const express = require("express")
const bodyParser = require("body-parser")
const validator = require("validator")
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/iServiceDB", {useNewUrlParser:true})

const app = express()
var id = 68

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

const formSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true
		},
		countryofresidence: {
			type: String,
			required: true
		},
		firstname: {
			type: String,
			minlength: 3,
			maxlength: 50,
			required: true
		},
		lastname: {
			type: String,
			minlength: 3,
			maxlength: 50,
			required: true
		},
		emailaddress: {
			type: String,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Email isn't valid")
				}
			},
			required: true
		},
		passwordinit: {
			type: String,
			minlength: 8,
			required: true
		},
		passwordconf: {
			type: String,
			minlength: 8,
			required: true
		},
		addressone: {
			type: String,
			required: true
		},
		addresstwo: {
			type: String,
			required: true
		},
		statecity: {
			type: String,
			required: true
		},
		stateprovinceregion: {
			type: String,
			required: true
		},
		zipcode: {
			type: Number
		},
		phonenumber: {
			type: String,
			validate(value) {
				if (!validator.isMobilePhone(value)) {
					throw new Error("Mobile isn't valid")
				}
			}
		}
	}
)

const Form = new mongoose.model('form', formSchema)

app.get('/', (req, res)=>{
	res.sendFile(__dirname + "/index.html")
})

app.post('/index.html', (req, res)=>{
	console.log(req.body)
	if (req.body["password-init"] != req.body["password-conf"]) {
		throw new Error("Passwords did not match")
	}

	id += 1

	const form = new Form(
		{
			_id: id,
			countryofresidence: req.body["country-of-residence"],
			firstname: req.body["first-name"],
			lastname: req.body["last-name"],
			emailaddress: req.body["email-address"],
			passwordinit: req.body["password-init"],
			passwordconf: req.body["password-conf"],
			addressone: req.body["address-1"],
			addresstwo: req.body["address-2"],
			statecity: req.body["state-city"],
			stateprovinceregion: req.body["state-province-region"],
			zipcode: req.body["zip-code"],
			phonenumber: req.body["phone-number"]
		}
	)
	form.save((err)=>{
		if (err) {
			console.log(err)
		}
		else {
			console.log("Inserted successfully")
		}
	})
})

app.listen(5000, (req, res)=>{
	console.log("Server is running on port 5000")
})
