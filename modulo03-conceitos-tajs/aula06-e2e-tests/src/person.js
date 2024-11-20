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
    
    return `registrado com sucesso!! ${JSON.stringify(person)}`
  }

  static process(person) {
    this.validate(person)
    const personFormat = this.format(person)
    const result = this.save(personFormat)
    return result
  }
}

export default Person