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

let lista3 = []
let jugador = {}

// Rutas
app.get('/', async (req, res) => {
  try {
    const hpApi = await axios.get("https://hp-api.onrender.com/api/characters")
    let pjConImg = {}
    hpApi.data.filter(pj => {
      if (pj.image !== '') {
        pjConImg[pj.image] = pj
      }
    })

    let pjConImgArray = Object.values(pjConImg)

    let lista1 = pjConImgArray.slice(0, 15)
    let lista2 = pjConImgArray.slice(0, 15)

    lista3 = lista1.concat(lista2)
    lista3.sort(() => Math.random() - 0.5)

    lista3 = lista3.map(element => {
      return { ...element, estado: 'tapada'}
    })

    res.render('index', {
      title: 'El juego de la memoria de Harry Potter',
      message: '-Elige una carta\r -Busca la carta que sea exactamente igual a la que elegiste\r -¡Sí coinciden sumá puntos!',
      personajes: lista3,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ err: "Error al acceder a la api" })
  }
})

app.post('/', (req, res) => {
  jugador = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email
  },
  res.redirect('/')
})

app.post('/save-game', (req, res) => {
  const { jugador, score } = req.body;
  saveGameData(jugador, score);
  res.status(200).send('Game data saved')
});

app.get('/top-score', (req, res) => {
  let partidas = [];
  if (fs.existsSync(partidasFile)){
    partidas = JSON.parse(fs.readFileSync(partidasFile));
  }
  res.render('top-scores', { partidas });
})

// Funciones
function saveGameData(jugador, score) {
  const partida = { jugador, score, date: new Date() };
  let partidas = [];

  if (fs.existsSync(partidasFile)) {
    partidas = JSON.parse(fs.readFileSync(partidasFile))
  }

  partidas.push(partida);
  partidas.sort((a,b) => a.score - b.score);
  partidas = partidas.slice(0, 20);// limitar a 20 jugadores

  fs.writeFileSync(partidasFile, JSON.stringify(partidas, null, 2));
}

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`)
})