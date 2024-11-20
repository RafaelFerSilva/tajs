import { describe, it, expect, jest } from '@jest/globals'
import Person from '../src/person'

describe('#Person Suite', () => {
  describe('#validator', () => {
    it('should throw if the name is not present', () => {
      const mockInvalidPerson = {
        name: '',
        cpf: '123.456.789-00'
      }
      expect(() => Person.validate(mockInvalidPerson)).toThrow(new Error('name is required'))
    })

    it('should throw if the cpf is not present', () => {
      const mockInvalidPerson = {
        name: 'Xuxa da Silva',
        cpf: ''
      }
      expect(() => Person.validate(mockInvalidPerson)).toThrow(new Error('CPF is required'))
    })

    it('should not throw if person is valid', () => {
      const mockInvalidPerson = {
        name: 'Xuxa da Silva',
        cpf: '123.456.789-00'
      }
      expect(() => Person.validate(mockInvalidPerson)).not.toThrow()
    })
  })

  describe('#format', () => {
    it('should format the person name and CPF', () => {
      // AAA

      // Arrange
      const mockPerson = {
        name: 'Xuxa da Silva',
        cpf: '000.999.444-11'
      }

      // Act
      const formattedPerson = Person.format(mockPerson)

      // Assert
      const expected = {
        name: 'Xuxa',
        cpf: '00099944411',
        lastName: 'da Silva'

      }

      expect(formattedPerson).toStrictEqual(expected)
    })
  })

  describe('#save', () => {
    it('should not save a person with empty name', () => {
      // Arrange
      const person = {
        name: '',
        cpf: '00099944411',
        lastName: 'da Silva'
      }

      // Assert
      expect(() => Person.save(person)).toThrow(new Error(`cannot save invalid person: ${JSON.stringify(person)}`))
    })

    it('should not save a person without name', () => {
      // Arrange
      const person = {
        cpf: '00099944411',
        lastName: 'da Silva'
      }

      // Assert
      expect(() => Person.save(person)).toThrow(new Error(`cannot save invalid person: ${JSON.stringify(person)}`))
    })

    it('should not save a person with empty cpf', () => {
      // Arrange
      const person = {
        name: 'Xuxa',
        cpf: '',
        lastName: 'da Silva'
      }

      // Assert
      expect(() => Person.save(person)).toThrow(new Error(`cannot save invalid person: ${JSON.stringify(person)}`))
    })

    it('should not save a person without cpf', () => {
      // Arrange
      const person = {
        name: 'Xuxa',
        lastName: 'da Silva'
      }

      // Assert
      expect(() => Person.save(person)).toThrow(new Error(`cannot save invalid person: ${JSON.stringify(person)}`))
    })

    it('should not save a person with empty lastName', () => {
      // Arrange
      const person = {
        name: 'Xuxa',
        cpf: '00099944411',
        lastName: ''
      }

      // Assert
      expect(() => Person.save(person)).toThrow(new Error(`cannot save invalid person: ${JSON.stringify(person)}`))
    })

    it('should not save a person without lastName', () => {
      // Arrange
      const person = {
        name: 'Xuxa',
        cpf: '00099944411'
      }

      // Assert
      expect(() => Person.save(person)).toThrow(new Error(`cannot save invalid person: ${JSON.stringify(person)}`))
    })

    it('should be save a valid person', () => {
      // Arrange
      const person = {
        name: 'Xuxa',
        cpf: '00099944411',
        lastName: 'da Silva'
      }

      // Act
      const result = Person.save(person)

      // Assert
      expect(result).toBe(`registrado com sucesso!! ${JSON.stringify(person)}`)
    })
  })

  describe("#process", () => {
    it('should process a valid person', () => {
      // Arrange
      const mockPerson = {
        name: 'Zezin da Silva',
        cpf: '00099944411',
      }

      jest.spyOn(
        Person,
        Person.validate.name
      ).mockReturnValue()

      jest.spyOn(
        Person,
        Person.format.name
      ).mockReturnValue({
        cpf: '00099944411',
        name: 'Zezin',
        lastName: 'da Silva'
      })

      // Act
      const result = Person.process(mockPerson)

      //Assert
      const expected = 'ok'
      expect(result).toStrictEqual(expected)
    })
  })
})