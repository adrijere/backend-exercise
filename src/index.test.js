const _ = require('lodash')
const supertest = require('supertest')
const { assert } = require('chai')

const db = require('./db')
const { listen } = require('./app')

let server
function request() {
    return supertest(server)
}

function setupApp(server_) {
    server = server_
}

before(done => {
    listen(4000)
        .then(server_ => {
            setupApp(server_)
        })
        .then(() => done())
})

after(done => {
    server.close(done)
})

describe('API', () => {

    describe('get list', () => {
        let users
        beforeEach(async () => {
            users = db._initDb().data
        })

        it('sends all users', async () => {
            await request()
                .get('/users')
                .expect(200)
                .expect(({ body }) => {
                    assert.deepEqual(
                        body,
                        users.map(u => _.omit(u, 'password'))
                    )
                })
        })

        it('send all users from a specified city', async () => {
            const parisian = users.filter(u => u.address.city === 'Paris')

            await request()
                .get('/users/filter?city=Paris')
                .expect(200)
                .expect(({ body }) => {
                    assert.deepEqual(
                        body,
                        parisian.map(u => _.omit(u, 'password'))
                    )
                })
        })
    })

    describe('create', () => {
        beforeEach(async () => {
            db._initDb()
        })

        it("doesn't work for with wrong data", async () => {
            await request()
                .post('/users')
                .send({
                    firstName: ' ',
                    lastName: 'aaa',
                    password: 'bbb',
                    email: 'aaa@clovis.pro',
                    address: {
                        city: 'ccc',
                        postalCode: 75000,
                    }
                })
                .expect(409)

            await request()
                .post('/users')
                .send({
                    firstName: 'aaa',
                    lastName: ' ',
                    password: 'bbb',
                    email: 'aaa@clovis.pro',
                    address: {
                        city: 'ccc',
                        postalCode: 75000,
                    }
                })
                .expect(409)

            await request()
                .post('/users')
                .send({
                    firstName: 'aaa',
                    lastName: 'aaa',
                    password: 'bbb',
                    email: 'aaa@clovis.pro',
                    address: {
                        city: ' ',
                        postalCode: 75000,
                    }
                })
                .expect(409)
        })

        it("doesn't work if the user already exists", async () => {
            await request()
                .post('/users')
                .send({
                    firstName: 'aaa',
                    lastName: 'aaa',
                    password: 'bbb',
                    email: 'alexis@clovis.pro',
                    address: {
                        city: 'aaaa',
                        postalCode: 75000,
                    }
                })
                .expect(409)
        })

        it("doesn't if password is less than 2 character long", async () => {
            await request()
                .post('/users')
                .send({
                    firstName: 'aaa',
                    lastName: 'aaa',
                    password: 'bb',
                    email: 'blabla@clovis.pro',
                    address: {
                        city: 'aaaa',
                        postalCode: 75000,
                    }
                })
                .expect(409)
        })

        it('works', async () => {
            let id
            const userDoc = {
                firstName: 'Jean',
                lastName: 'Perrard',
                password: '123456',
                email: 'jean@clovis.pro',
                address: {
                    city: 'Paris',
                    postalCode: 75000,
                },
            }

            await request()
                .post('/users')
                .send(userDoc)
                .expect(200)
                .expect(({ body }) => {
                    assert.deepEqual(
                        _.omit(body, '_id'),
                        _.omit(userDoc, 'password'),
                    )

                    id = body._id
                })

            assert(await db.findById(id))

            const userDoc2 = {
                firstName: 'Harry   ',
                lastName: 'Devin    ',
                password: '123456',
                email: 'harry@clovis.pro',
                address: {
                    city: 'Paris   ',
                    postalCode: 75000,
                },
            }

            await request()
                .post('/users')
                .send(userDoc2)
                .expect(200)
                .expect(({ body }) => {
                    assert.deepEqual(
                        _.omit(body, '_id'),
                        _.omit({
                            firstName: 'Harry',
                            lastName: 'Devin',
                            password: '123456',
                            email: 'harry@clovis.pro',
                            address: {
                                city: 'Paris',
                                postalCode: 75000,
                            },
                        }, 'password'),
                    )

                    id = body._id
                })

            assert(await db.findById(id))
        })
    })

    describe('update', () => {
        let data
        beforeEach(() => {
            data = db._initDb().data
        })

        it("doesn't work if user is not found", async () => {
            await request()
                .put('/users/id/100')
                .send({ firstName: 'Alexis' })
                .expect(404)
        })

        it('works', async () => {
            await request()
                .put('/users/id/1')
                .send({ firstName: 'David' })
                .expect(200)
                .expect(({ body }) => {
                    assert.deepEqual(
                        body,
                        _.omit({ ...data[1], firstName: 'David' }, 'password'),
                    )
                })

            const newDoc = await db.findById(1)
            assert(newDoc.firstName === 'David')
        })
    })

    describe('delete', async () => {
        it("doesn't work if user is not found", async () => {
            await request()
                .delete('/users/id/100')
                .expect(404)
        })


        it('works', async () => {
            await request()
                .delete('/users/id/1')
                .expect(204)

            assert(!await db.findById(1))
        })
    })
})
