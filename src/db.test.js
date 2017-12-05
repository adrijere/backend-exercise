const _ = require('lodash')
const { assert } = require('chai')

const db = require('./db')

describe('DB', () => {

    describe('find', () => {

        let data
        beforeEach(() => {
            data = db._initDb().data.slice()
        })

        it('works without criterias', async () => {
            const dbData = await db.find()
            assert.deepEqual(
                data,
                dbData,
            )
        })

        it('works with simple criterias', async () => {
            let results = await db.find({
                firstName: 'Alexis',
            })
            assert(results.length === 1)
            assert(results[0].lastName === 'Ablain')

            results = await db.find({
                email: 'marcel@clovis.pro',
            })
            assert(results.length === 1)
            assert(results[0].lastName === 'Dupont')
        })

        it('works with deep objects', async () => {
            let results = await db.find({
                'address.postalCode': 75000,
            })
            assert(results.length === 2)

            results = await db.find({
                'address.city': 'Angoulême',
            })
            assert(results.length === 1)

            results = await db.find({
                'address.city': 'Lyon',
            })
            assert(results.length === 0)
        })

        it('works with multiple criterias', async () => {
            let results = await db.find({
                lastName: 'Dupont',
            })
            assert(results.length === 2)

            results = await db.find({
                firstName: 'Marcel',
                lastName: 'Dupont',
            })
            assert(results.length === 1)
        })
    })

    describe('findById', () => {

        let data
        beforeEach(() => {
            data = db._initDb().data.slice()
        })

        it('works', async () => {
            const dbData = await Promise.all(
                data.map(d => db.findById(d._id))
            )

            assert.deepEqual(
                data,
                dbData,
            )

            const result = await db.findById(100)
            assert(result === undefined)
        })
    })

    describe('create', () => {

        let currentMaxId
        beforeEach(() => {
            currentMaxId = db._initDb().idCounter
        })

        it('fails if we try to set the _id key', async () => {
            try {
                await db.create({ _id: 'test' })
            } catch (e) {
                assert(e instanceof db.dbError)
                return
            }

            assert(false)
        })

        it('works', async () => {
            const docDef = {
                firstName: 'Lea',
                lastName: 'Fabre',
                password: 'lea123',
                address: {
                    city: 'Monistrol sur Loire',
                    postalCode: 43210,
                }
            }
            const newDoc = await db.create(docDef)

            assert(newDoc._id === currentMaxId)


            const dbDoc = await db.findById(newDoc._id)
            assert.deepEqual(
                _.omit(dbDoc, '_id'),
                docDef,
            )
        })
    })

    describe('updateById', () => {

        let data
        beforeEach(() => {
            data = db._initDb().data.slice()
        })

        it('returns false if id is not found', async () => {
            assert(!await db.updateById(100))
        })

        it('works to update a key', async () => {
            const result = await db.updateById(0, {
                firstName: 'Georges',
            })

            assert(result)

            const newDoc = await db.findById(0)
            assert.deepEqual(
                newDoc,
                {
                    ...data[0],
                    firstName: 'Georges',
                }
            )
        })

        it('works to add new keys', async () => {
            const keys = {
                age: 23,
                nodesjSkill: 'infinite',
            }
            assert(await db.updateById(0, keys))

            const newDoc = await db.findById(0)
            assert.deepEqual(
                newDoc,
                {
                    ...data[0],
                    ...keys,
                }
            )
        })
    })

    describe('removeById', () => {

        let data
        beforeEach(() => {
            data = db._initDb().data.slice()
        })

        it('returns false if id is not found', async () => {
            assert(!await db.removeById(100))
        })

        it('works', async () => {
            assert(await db.removeById(1))

            const newData = await db.find()
            assert(newData.length === data.length - 1)
            assert(!newData.find(item => item._id === 1))
        })
    })
})
