const koa = require('koa')
const app = new koa()

const router = require('./controllers')

app.use(require('koa-bodyparser')({
    enableTypes: ['json'],
}))

app
    .use(router.routes())
    .use(router.allowedMethods())

module.exports = {
    listen: port => new Promise((resolve, reject) => {
        const server = app.listen(port, err => {
            if (err) {
                reject(err)
            }

            console.log('Listenning on ' + port)
            resolve(server)
        })
    }),

    app,
}
