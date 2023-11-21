const { Router } = require('express');
const { Activity, Country } = require('../db.js');
const { Op } = require("sequelize");

const router = Router();

// Ruta para obtener todas las actividades almacenadas en la base de datos.
router.get('/activities', async (req, res) => {
  
  // Utiliza Sequelize para buscar y obtener todas las actividades almacenadas.
  const activities = await Activity.findAll();
  
  // Verifica si se encontraron actividades.
  if (activities) {
    // Devuelve un código de estado 200 (OK) y un objeto JSON con las actividades.
    return res.status(200).json(activities);
  } else {
    // Devuelve un código de estado 404 (No encontrado) y un mensaje JSON indicando que no se encontraron actividades.
    return res.status(404).json(activities.length ? activities : "No se encontraron actividades");
  }
});

// Ruta para agregar una nueva actividad a la base de datos.
router.post('/activities', async (req, res, next) => {
  try {
    // Extrae los datos necesarios del cuerpo de la solicitud.
    const { name, difficulty, duration, season, countries } = req.body;
    
    // Verifica que todos los datos requeridos estén presentes.
    if (name && difficulty && duration && season && countries) {
      
      // Crea una nueva actividad en la base de datos.
      const activity = await Activity.create({
        name,
        difficulty,
        duration,
        season
      });

      // Itera sobre los IDs de países proporcionados y asocia la actividad con cada país.
      countries.forEach(async (id) => {
        // Busca el país en la base de datos por ID.
        const country = await Country.findOne({
          where: { id: { [Op.iLike]: `%${id}%` } }
        });
        
        // Asocia la actividad con el país encontrado.
        await country?.addActivity(activity);
      });

      // Devuelve la actividad creada.
      return res.send(activity);
    } else {
      // Si falta algún dato, devuelve un código de estado 404 (No encontrado) y un mensaje JSON indicando que faltan datos.
      return res.status(404).json('Faltan datos');
    }
  } catch (error) {
    // Si ocurre un error, pasa el error al siguiente middleware.
    next(error);
  }
});


module.exports = router;