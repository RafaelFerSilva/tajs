import { describe, expect, it, beforeEach, jest } from '@jest/globals'
import Service from '../src/service.js'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'

describe('#Service Test Suite', () => {
  let _service
  const filename = 'users.ndjson'
  const MOCKED_HASH_PWD = 'hashfdrfewrdsfsds'

  describe("#create - spies", () => {
    beforeEach(() => {
      jest.spyOn(
        crypto,
        crypto.createHash.name
      ).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue(MOCKED_HASH_PWD),
      })

      jest.spyOn(
        fs,
        fs.appendFile.name
      ).mockResolvedValue()

      _service = new Service({
        filename
      })
    })

    it("should call append file with right params", async () => {
      // Arrange
      const input = {
        username: 'user1',
        password: 'pass1'
      }
      const expectCreatedAtt = new Date().toISOString()
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(expectCreatedAtt)

      // Act
      await _service.create(input)
      
      // Assert
      expect(crypto.createHash).toHaveBeenCalledWith('sha256')
      
      const hash = crypto.createHash('sha256')
      expect(hash.update).toHaveBeenCalledWith(input.password)
      expect(hash.digest).toHaveBeenCalledWith('hex')

      const expected = JSON.stringify({
        ...input,
        createdAt: expectCreatedAtt,
        password: MOCKED_HASH_PWD
      }).concat('\n')

      expect(fs.appendFile).toHaveBeenCalledWith(filename, expected)
    })

  })
})