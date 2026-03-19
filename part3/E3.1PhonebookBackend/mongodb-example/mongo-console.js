const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack_db_user:${password}@cluster0.i0zdjs6.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

//Case A: Only password → LIST ALL ENTRIES
if (process.argv.length === 3) {
  console.log('phonebook:')

  Person.find({}).then((result) => {
    console.log(result)
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

//Case B: Password + name + number → ADD ENTRY

if (process.argv.length === 5) {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

//RUN
//node mongo.js password
//node mongo.js password "Arto Vihavainen" 045-1232456
