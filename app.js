
const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')

const  app = express()

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routse/auth.route'))
app.use('/api/link', require('./routse/link.routes'))
app.use('/t', require('./routse/redirect.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000

async function start() {
    try {
        await  mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => {
            console.log(`App has been started on port ${PORT} ...`)})
    } catch (e) {
        console.log('Помилка серверу, ', e.message)
        process.exit(1)
    }
}

start()

