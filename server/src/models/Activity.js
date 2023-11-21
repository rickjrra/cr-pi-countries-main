const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
  sequelize.define('Activity', {
    
    // Campo 'name' de tipo STRING que no puede ser nulo.
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    // Campo 'difficulty' de tipo INTEGER que no puede ser nulo, con validaciones adicionales.
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate : {
        // Validación: el valor debe estar entre 1 y 5.
        min: 1,
        max: 5,
        isEven(value) {
          // Validación personalizada: la dificultad debe ser un número par entre 1 y 5.
          if(value < 1 || value > 5) {
            throw new Error("La dificultad debe ser entre 1 y 5");
          }
        }
      }
    },
    
    // Campo 'duration' de tipo INTEGER que no puede ser nulo, con validaciones adicionales.
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        // Validación: el valor debe estar entre 1 y 24.
        min: 1,
        max: 24,
        isEven(value) {
          // Validación personalizada: la duración debe ser un número par entre 1 y 24.
          if(value < 1 || value > 24) {
            throw new Error('La duración debe ser de 1 a 24');
          }
        } 
      }   
    },
    
    // Campo 'season' de tipo ENUM que solo puede tener valores "Verano", "Otoño", "Invierno" o "Primavera", y no puede ser nulo.
    season: {
      type: DataTypes.ENUM("Verano", "Otoño", "Invierno", "Primavera"),
      allowNull: false,
    },
    
  } , {
    // Configuración adicional del modelo. En este caso, se desactivan los timestamps automáticos.
    timestamps: false
  });
};