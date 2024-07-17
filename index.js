const express = require('express')
const axios = require('axios')
const path = require('path')
const app = express()
const port = 3000
const pug = require('pug')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.static('public'))

let lista3 = []

app.get('/', async (req, res) => {
  try {
    const hpApi = await axios.get("https://hp-api.onrender.com/api/characters")
    let pjConImg = {}
    hpApi.data.forEach(pj => {
      if (pj.image !== '') {
        pjConImg[pj.image] = pj
      }
    })

    let pjConImgArray = Object.values(pjConImg)

    let lista1 = pjConImgArray.slice(0, 15)
    let lista2 = pjConImgArray.slice()

    lista3 = lista1.concat(lista2)
    lista3.sort(() => Math.random() - 0.5)

    lista3 = lista3.map(element => {
      return { ...element, estado: 'tapada' }
    })

    res.render('index', {
      title: 'Bienvenido',
      message: '¡Hola Mundo!',
      personajes: lista3
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Error al acceder a la api" })
  }
})

app.get('/toggle-card-state', (req, res) => {
  const { name } = req.query;
  const personaje = lista3.find(pj => pj.name === name);

  if (personaje) {
    if (personaje.estado === 'tapada') {
      personaje.estado = 'destapada';
    } else {
      personaje.estado = 'tapada';
    }

    res.json({ 
      estado: personaje.estado,
      image: personaje.image
    });
  } else {
    res.status(404).json({ error: 'Personaje no encontrado' });
  }
});


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
})