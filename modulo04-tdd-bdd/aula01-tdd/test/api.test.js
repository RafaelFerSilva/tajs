import { expect, it, describe, beforeAll, afterAll, afterEach, jest } from '@jest/globals'
import { server } from '../src/api.js'


describe('#API Users E2E Suite', () => {
  let _testServer
  let _testServerAddress

  function createUser(data) {
    return fetch(`${_testServerAddress}/users`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async function findUserById(id) {
    const user = await fetch(`${_testServerAddress}/users/${id}`)
    return user.json()
  }

  function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
      server.once('error', (err) => reject(err))
      server.once('listening', () => resolve())
    })
  }

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    _testServer = server.listen()

    await waitForServerStatus(_testServer)

    const serverInfo = _testServer.address()
    _testServerAddress = `http://localhost:${serverInfo.port}`
  })

  afterAll(done => {
    server.closeAllConnections()
    _testServer.close(done)
  })

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should register a new user with young-adult category', async () => {
    const expectedCategory = 'young-adult'
    jest.useFakeTimers({
      now: new Date('2024-11-22T00:00')
    })
    const response = await createUser({
      name: 'Xuxa da Silva',
      birthDay: '2003-01-01'
    })

    expect(response.status).toBe(201)
    const result = await response.json()
    expect(result.id).not.toBeUndefined()

    const user = await findUserById(result.id)
    expect(user.category).toBe(expectedCategory)

  })

  it.todo('should register a new user with adult category')
  it.todo('should register a new user with senior category')

  it('should throw an error when registering a unde-age user', async () => {
    const response = await createUser({
      name: 'Xuxa da Silva',
      birthDay: '2018-01-01'
    })

    expect(response.status).toBe(400)
    const result = await response.json()
    expect(result).toEqual({
      message: 'User must be 18yo or older'
    })
  })
})