const express = require('express')
const axios = require('axios')
const path = require('path')
const app = express()
const port = 3000
const pug = require('pug')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.static('public'))

app.get('/',async (req, res) => {
  try {
    const hpApi = await axios.get("https://hp-api.onrender.com/api/characters")
    let pjConImg = hpApi.data.filter((pjImg) => pjImg.image != '')
    let lista1 = pjConImg.slice(0,15)
    
   let lista3 = []
   for (let i =0; i < 15; i++ ){
      lista3.push(pjConImg[i])
      lista3.push(pjConImg[i])
    }
    console.log(lista3);
    lista3.sort(() => Math.random() - 0.5)
    
    lista3.forEach(element => {
      element.estado = 'tapada'
    })
    lista3[0].estado = 'destapada'

    console.log(lista3);
    res.render('index', {title: 'Bienvenido', message: '¡Hola Mundo!', personajes: lista3})
  } catch (err) {
    console.error(err);
    res.status(500).json( {err : "Error al acceder a la api"})
  }
})

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
})