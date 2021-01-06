const { NextFunction, Request, Response } = require('express')
const { validateAuthToken } = require('./index')
const { generateAccessToken } = require('../helpers')

describe('Middleware Test', () => {
  let mockRequest,
   mockResponse,
   nextFunction = jest.fn()

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn()
    }
  })

  test('without headers', () => {
    validateAuthToken(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.send).toBeCalledWith('No Auth header');
    expect(mockResponse.status).toBeCalledWith(401);
  })
  
  test('without auth headers', () => {
    mockRequest = {
      headers: {}
    }
    validateAuthToken(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.send).toBeCalledWith('No Auth header');
    expect(mockResponse.status).toBeCalledWith(401);
  })
  
  test('with auth headers', () => {
    generateAccessToken({
      "name": "Prashant Singh",
      "username": "prashant1k9"
    }).then(token => {
      mockRequest = {
        headers: {
          'authorization': `Bearer ${token}`
        }
      }
      validateAuthToken(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toBeCalledTimes(1);
    })
  })
})