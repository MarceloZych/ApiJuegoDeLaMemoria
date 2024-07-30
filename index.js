const express = require('express')
const axios = require('axios')
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()
const port = 3000
const partidasFile = path.join(__dirname, 'partidas.json')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

let jugador = {}
let lista3 = []

// Rutas
app.get('/', (req, res) => {
  res.render('register', {
    title: 'Registro del jugador'
  })
})

app.post('/register', (req, res) => {
  jugador = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email
  };
  res.redirect('/game'); // Redirigir a la página del juego
});

app.get('/game', async (req, res) => {
  try {
    const personajes = await fetchPersonajes()
    const cartas = prepareCartas(personajes)
    res.render('index', {
      title: 'El juego de la memoria de Harry Potter',
      message: '-Elige una carta\r -Busca la carta que sea exactamente igual a la que elegiste\r -¡Sí coinciden sumá puntos!',
      personajes: cartas,
      jugador: jugador
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ err: "Error al acceder a la api" })
  }
})

app.post('/save-game', (req, res) => {
  const { jugador, score } = req.body;
  //console.log('jugador recibido', jugador);
  //console.log('puntuacion recibida', score);
  saveGameData(jugador, score);
  res.status(200).send('Game data saved')
});

app.get('/top-score', (req, res) => {
  const partidas = loadPartidas()
  res.render('top-score', { partidas });
})

// Funciones
async function fetchPersonajes() {
  const response = await axios.get("https://hp-api.onrender.com/api/characters")
  return response.data.filter(pj => pj.image !== '')
}

function prepareCartas(personajes) {
  const cartas = [...personajes, ...personajes]
    .map(pj => ({ ...pj, estado: 'tapada' }))
    .sort(() => Math.random() - 0.5)
    .slice(0, 15)
  return cartas
}

function saveGameData(jugador, score) {
  const partida = { jugador, score, date: new Date() };
  let partidas = loadPartidas();

  partidas.push(partida);
  partidas.sort((a, b) => a.score - b.score);
  const topPartidas = partidas.slice(0, 20);// limitar a 20 jugadores

  fs.writeFileSync(partidasFile, JSON.stringify(topPartidas, null, 2));
  console.log('Partida guardada:', partida);
  console.log('Partidas actuales:', partidas);
}

function loadPartidas() {
  if (fs.existsSync(partidasFile)) {
    return JSON.parse(fs.readFileSync(partidasFile))
  }
  return []
}

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`)
})