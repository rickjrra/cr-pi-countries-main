const { Router } = require('express');
const axios = require("axios");
const { Op, Country, Activity } = require("../db.js");

// Importa la biblioteca express.
const e = require('express');

// Crea una instancia de Router de Express.
const router = Router();

// Función asíncrona para obtener información de países desde una API externa.
const getServerInfo = async () => {
    const response = await axios.get("http://localhost:5000/countries");

    const map = response.data.map(e => {
        // Mapea la respuesta de la API a un objeto con ciertos campos específicos.
        const country = {
            id: e.cca3,
            name: e.name.common,
            imgFlag: e.flags[1],
            continent: e.continents[0],
            capital: e.capital != null ? e.capital[0] : "No data",
            subregion: e.subregion,
            area: e.area,
            population: e.population
        }
        return country;
    });
    return map;
};

// Función asíncrona para cargar países en la base de datos desde la API.
const countriesToDb = async () => {
    try {
        // Busca todos los países en la base de datos.
        const countries = await Country.findAll();
        if (!countries.length) {
            // Si no hay países en la base de datos, obtén la información de la API y agrega los países a la base de datos.
            const array = await getServerInfo();
            await Country.bulkCreate(array);
        }
    } catch (error) {
        console.log(error);
    }
};

// Función asíncrona para cargar países en la base de datos.
const loadCountries = async () => { await countriesToDb() }
loadCountries();

// Ruta para obtener todos los países o filtrar por nombre.
router.get("/countries", async (req, res) => {
    
    // Obtiene el parámetro de consulta "name" de la solicitud.
    const name = req.query.name;

    try {
        // Verifica si no se proporcionó el parámetro "name".
        if (!name) {
            // Obtiene todos los países de la base de datos, incluyendo información sobre actividades asociadas.
            const countries = await Country.findAll({
                include: [{
                    model: Activity,
                    attributes: ['name', 'difficulty', 'duration', 'season'],
                    through: { attributes: [] }
                }]
            });

            // Verifica si se encontraron países.
            if (countries) {
                // Devuelve un código de estado 200 (OK) y un objeto JSON con los países.
                return res.status(200).json(countries);
            } else {
                // Devuelve un código de estado 404 (No encontrado) y un mensaje indicando que no se encontraron países.
                return res.status(404).send("No se encontraron países");
            }
        } else {
            // Si se proporcionó el parámetro "name", busca países por nombre, incluyendo información sobre actividades asociadas.
            const country = await Country.findAll({
                where: {
                    name: { [Op.substring]: name }
                },
                include: [{
                    model: Activity,
                    attributes: ['name', 'difficulty', 'duration', 'season'],
                    through: { attributes: [] }
                }]
            });

            // Verifica si se encontraron países.
            if (country) {
                // Devuelve un código de estado 200 (OK) y un objeto JSON con los países encontrados.
                return res.status(200).json(country);
            } else {
                // Devuelve un código de estado 404 (No encontrado) y un mensaje indicando que el país no fue encontrado.
                return res.status(404).send("País no encontrado");
            }
        }
    } catch (error) {
        // Maneja errores imprevistos imprimiéndolos en la consola.
        console.log(error);
    }
});

// Ruta para obtener información de un país por su ID.
router.get('/countries/:idPais', async (req, res) => {
    // Obtiene el parámetro de la URL que representa el ID del país.
    const idPais = req.params.idPais;

    try {
        // Busca un país en la base de datos por su ID, incluyendo información sobre actividades asociadas.
        const country = await Country.findOne({
            where: {
                id: idPais.toUpperCase()
            },
            include: [{
                model: Activity,
                attributes: ['name', 'difficulty', 'duration', 'season'],
                through: { attributes: [] }
            }]
        });

        // Verifica si se encontró el país.
        if (country) {
            // Devuelve un código de estado 200 (OK) y un objeto JSON con la información del país.
            return res.status(200).json(country);
        } else {
            // Devuelve un código de estado 404 (No encontrado) y un mensaje indicando que el país no fue encontrado.
            return res.status(404).send("País no encontrado");
        }
    } catch (error) {
        // Maneja errores imprevistos imprimiéndolos en la consola.
        console.log(error);
    }
});

module.exports = router;
