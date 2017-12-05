
# Clovis users dashboard
![logo](images/logo-clovis.png)

#### Happy to see you there :sunglasses: !

No time for :coffee: let's go..

## Instructions

You have to create a simple REST API to allow our team to **perform CRUD operations on Clovis' users**.

This API will be used by our Clovis admin dashboard to manage our customers accounts.

No less, no more, you have **1 hour** !

## Rules

* Because Clovis backend use [KoaJS](http://koajs.com/) as web framework you must also use it in this exercise.
* You must be able to insert, fetch, update and delete users accounts
* All tests must pass (even the lint !)

If you have a problem, start by reading the API and database tests and KoaJS doc. If it doesn't help you, ask for help !

## Technical details

* `index.js` and `app.js` files are already coded, you just have to code controllers in `src/controllers.js`
* You should read [koa-router](https://github.com/alexmingoia/koa-router/tree/master) documentation
* You may use [lodash](https://lodash.com/)

In this exercise you will use a **really** simple database engine. Allowed methods are :
* find
* findById
* create
* updateById
* removeById

If you want to query nested keys use find like in this example :
```
db.find({
    'address.postalCode': 75000,
})

db.find({
    'hobbies[0].name': 'NodeJS',
})

...
```
