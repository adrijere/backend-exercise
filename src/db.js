const _ = require('lodash')

let data = []
let idCounter = 0

class dbError {
    constructor(message) {
        this.message = message
    }
}

function _initDb() {
    data = [
        {
            firstName: 'Alexis',
            lastName: 'Ablain',
            email: 'alexis@clovis.pro',
            password: '123456',
            address: {
                city: 'Angoulême',
                postalCode: 16000,
            },
        },
        {
            firstName: 'Clément',
            lastName: 'Fradet Normand',
            email: 'clement@clovis.pro',
            password: '456789',
            address: {
                city: 'Paris',
                postalCode: 75000,
            },
        },
        {
            firstName: 'Marcel',
            lastName: 'Dupont',
            email: 'marcel@clovis.pro',
            password: 'marcelDupont',
            address: {
                city: 'Annecy',
                postalCode: 74000,
            },
        },
        {
            firstName: 'François',
            lastName: 'Dupont',
            email: 'francois@clovis.pro',
            password: 'azertt',
            address: {
                city: 'Rochefort',
                postalCode: 17300,
            },
        },
        {
            firstName: 'Clotilde',
            lastName: 'Durand',
            email: 'clotilde.durand@gmail.com',
            password: 'cloclo',
            address: {
                city: 'Reims',
                postalCode: 51100,
            },
        },
        {
            firstName: 'Robert',
            lastName: 'Ducreux',
            email: 'robert@clovis.pro',
            password: 'chaton',
            address: {
                city: 'Paris',
                postalCode: 75000,
            },
        },
    ].map((item, index) => ({
        ...item,
        _id: index,
    }))

    idCounter = data.length

    return {
        data,
        idCounter,
    }
}

async function find(criterias = null) {
    if (!criterias) {
        return data
    }

    return data.filter(item => {
        const validate = Object
            .keys(criterias)
            .map(key => {
                const value = _.get(item, key)
                return value === undefined ? false : (value === criterias[key])
            })

        return !validate.some(criteria => criteria === false)
    })
}

async function findById(id) {
    id = parseInt(id)
    return data.find(item => item._id === id)
}

async function create(doc) {
    if ('_id' in doc) {
        throw new dbError('`_id` key must be set by the db engine')
    }

    doc = {
        ...doc,
        _id: idCounter,
    }

    data.push(doc)

    idCounter++

    return doc
}

async function updateById(id, options) {
    id = parseInt(id)
    const docIndex = data.findIndex(item => item._id === id)

    if (docIndex === -1) {
        return false
    }

    data[docIndex] = {
        ...data[docIndex],
        ...options,
    }

    return true
}

async function removeById(id) {
    id = parseInt(id)
    const docIndex = data.findIndex(item => item._id === id)

    if (docIndex === -1) {
        return false
    }

    data.splice(docIndex, 1)

    return true
}

module.exports = {
    _initDb,
    dbError,
    find,
    findById,
    create,
    updateById,
    removeById,
}
