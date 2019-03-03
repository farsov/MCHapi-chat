'use strict'

const config = require('./config/config.json')
const Hapi = require('hapi')
const handlebars = require('handlebars')
const inert = require('inert')
const path = require('path')
//const routes = require('./routes')
const vision = require('vision')

const server = Hapi.server({
  port: process.env.PORT || 4000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'public')
    },
    cors: {
      origin: ["*"]
    }

  }
})

async function init() {


  try {

    await server.register(inert)
    await server.register(vision)
    await server.register({ plugin: require('./plugins/seneca'), options: config.seneca })

    server.views({
      engines: { // --- hapi puede usar diferentes engines
        hbs: handlebars // --- asociamos el plugin al tipo de archivos  
      },
      relativeTo: __dirname, // --- para que las vistas las busque fuera de /public
      path: 'views', // --- directorio donde colocaremos las vistas dentro de nuestro proyecto
      layout: true, // --- indica que usaremos layouts 
      layoutPath: 'views' // --- ubicación de los layouts
    })

    await server.register(require('./controllers/usersController'))
    await server.start()

    console.log(`Servidor lanzado en: ${server.info.uri}`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }


}

init()