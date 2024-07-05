const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/',async (req, res) => {
  try {
    const hpApi = await axios.get("https://hp-api.onrender.com/api/characters")
    res.json(hpApi.data)
    console.log(hpApi.data)
  } catch (err) {
    console.error(err);
    res.status(500).json( {err : "Error al acceder a la api"})
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});