import test from 'ava'
import app from '../src/app'
import axios, {AxiosError} from 'axios'
import * as http from 'http'

const server = http.createServer(app.callback())
const req = axios.create({baseURL: 'http://localhost:8110'})

test.before('start server', async t => {
  server.listen(8110)
})

test.after('end server', t => {
  server.close()
})

test('Get method', async t => {
  try {
    const res = await req.get('/method/get?say=Hello%20World!!')
    t.deepEqual(res.data.data, {say: 'Hello World!!'})
  } catch(err) {
    t.fail(err.message)
  }
})

test('Post method', async t => {
  try {
    const res = await req.post('/method/post', {say: 'Hello World!!'})
    t.deepEqual(res.data.data, {say: 'Hello World!!'})
  } catch(err) {
    t.fail(err.message)
  }
})

test('Right params', async t => {
  try {
    const res = await req.get('/param/foo/bar')
    t.deepEqual(res.data.data, {to: 'foo', path: 'bar'})
  } catch(err) {
    t.fail(err.message)
  }
})

test('@Before, @BeforEach must be orderly', async t => {
  const res = await req.get('/before')
  const data: number[] = res.data.data
  t.true(data.length > 0)
  data.forEach((val, idx) => {
    t.is(val, idx)
  })
})

test('Authorized', async t => {
  try {
    const res = await req.get('/auth', {headers: {
      'x-access-token': 'naki'
    }})
    t.is(res.data.data, 'Authorized!!')
  } catch(err) {
    t.fail(err.message)
  }
})

test('Unauthorized', async t => {
  const err: AxiosError = await t.throws(req.get('/auth'))
  t.is(err.message, 'Request failed with status code 401')
  t.is(err.response.data.error.message, 'Unauthorized')
})
