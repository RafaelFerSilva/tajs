class Person {
  static validate(person) {
    if(!person.name) throw new Error('name is required')
    if(!person.cpf) throw new Error('CPF is required')
  }

  static format(person) {
    const [name, ...lastName] = person.name.split(' ')
    return {
      cpf: person.cpf.replace(/\D/g, ''),
      name,
      lastName: lastName.join(' ')
    }
  }

  static save(person) {
    if(!['cpf', 'name', 'lastName'].every(prop => person[prop])) {
      throw new Error(`cannot save invalid person: ${JSON.stringify(person)}`)
    }

    console.log('registrado com sucesso!! ', person)
    return `registrado com sucesso!! ${JSON.stringify(person)}`
  }

  static process(person) {
    this.validate(person)
    const personFormat = this.format(person)
    this.save(personFormat)
    return 'ok'
  }
}

Person.process({ 
    name: 'Zezin da Silva', 
    cpf: '123.456.789-00' 
  })

export default Person