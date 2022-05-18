/* eslint-env jest */
import app from './app'
import request from 'supertest'

it('testing to See if Jest Works', () => {
  expect(1).toBe(1)
})

describe('GET /', () => {
  it('responds to GET / request', async () => {
    const result = await request(app).get('/').send()
    expect(result.status).toBe(200)
    expect(result.text).toBe('Sovryn boilerplate Service Running. Stay Sovryn.')
  })
})
