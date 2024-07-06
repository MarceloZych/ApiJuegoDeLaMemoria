const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/',async (req, res) => {
  try {
    const hpApi = await axios.get("https://hp-api.onrender.com/api/characters")
    res.json(hpApi.data)
    res.render('index', {title: 'Bienvenido', message: '¡Hola Mundo!', personajes: hpApi.data})
    console.log(hpApi.data)
  } catch (err) {
    console.error(err);
    res.status(500).json( {err : "Error al acceder a la api"})
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});