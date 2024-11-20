import { expect, it, describe, jest, beforeAll, afterAll, afterEach } from '@jest/globals'
import Person from '../src/person.js'

function waitForServerStatus(server) {
  return new Promise((resolve, reject) => {
    server.once('error', (err) => reject(err))
    server.once('listening', () => resolve())
  })
}

describe('E2E Test Suite', () => {
  describe('#E2E test for server in a non-test env', () => {
    it('should start server with PORT 4000', async () => {
      const PORT = 4000
      process.env.NODE_ENV = 'production'
      process.env.PORT = PORT
      jest
        .spyOn(
          console,
          console.log.name
        )

      const { default: server } = await import('../src/index.js')
      await waitForServerStatus(server)

      const serverInfo = server.address()
      expect(serverInfo.port).toBe(4000)

      expect(console.log).toHaveBeenCalledWith(`server is running at ${serverInfo.address}:${serverInfo.port}`)

      return new Promise(resolve => server.close(resolve))
    })
  })


  describe('#E2E Tests to Server', () => {
    let _testServer
    let _testServerAddress

    beforeAll(async () => {
      process.env.NODE_ENV = 'test'
      const { default: server } = await import('../src/index.js')
      _testServer = server.listen()

      await waitForServerStatus(_testServer)

      const serverInfo = _testServer.address()
      _testServerAddress = `http://localhost:${serverInfo.port}`
    })

    afterAll(done => _testServer.close(done))

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return 404 for unsupported routes', async () => {
      const response = await fetch(`${_testServerAddress}/unsupported`, {
        method: 'POST'
      })
      expect(response.status).toBe(404)

    })

    it('should return 400 and missing field message when cpf is missing', async () => {
      const invalidPersons = { name: 'Fulano da Silva' }
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPersons)
      })
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.validationError).toEqual('CPF is required')
    })

    it('should return 400 and missing field message when cpf is empty', async () => {
      const invalidPersons = {
        name: 'Fulano da Silva',
        cpf: ''
      }
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPersons)
      })
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.validationError).toEqual('CPF is required')
    })

    it('should return 400 and missing field when name is missing', async () => {
      const invalidPersons = { cpf: '123.456.789.12' }
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPersons)
      })
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.validationError).toEqual('name is required')
    })

    it('should return 400 and missing field when name is empty', async () => {
      const invalidPersons = {
        name: '',
        cpf: '123.456.789.12'
      }

      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPersons)
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.validationError).toEqual('name is required')
    })

    it('should return 500 for unexpected errors', async () => {
      const validPerson = { name: 'John Doe', cpf: '123.456.789-10' };

      let spy = jest.spyOn(Person, 'process').mockImplementation(() => {
        throw new Error('Unexpected error!');
      });

      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(validPerson)
      })

      expect(response.status).toBe(500);
    })

    it('should be register a user', async () => {
      const person = {
        name: 'Rafael Silva',
        cpf: '123.456.789.12'
      }

      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(person)
      })

      expect(response.status).toBe(200)
    })
  })
})