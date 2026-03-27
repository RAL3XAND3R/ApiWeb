// Importamos las funciones para generar validadores (body, param, etc.)
import { body, validationResult } from 'express-validator';

/* ---------------------------
   Helper: runValidations
   ---------------------------
   - Recibe un array de validaciones (p. ej. [ body(...), body(...), ... ])
   - Ejecuta cada validación contra la petición
   - Revisa validationResult y, si hay errores, responde 400 con formato estandarizado
   - Si no hay errores, llama a next() para continuar con el siguiente middleware/controlador
*/
export const runValidations = (validations) => {
  // Devolvemos un middleware estándar (req, res, next)
  return async (req, res, next) => {
    // Iteramos cada validación y la ejecutamos (run) contra req
    for (const validation of validations) {
      await validation.run(req);
    }

    // Obtenemos el resultado de las validaciones
    const errors = validationResult(req);

    // Si no hay errores, continuamos con el siguiente middleware / controlador
    if (errors.isEmpty()) {
      return next();
    }

    // Si existen errores, respondemos con estado 400 y lista de errores
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  };
};

/* ---------------------------
   Validadores para crear usuario (POST)
   ---------------------------
   - nombre: obligatorio, no vacío, trim()
   - email: obligatorio, formato correcto
   - contrasenia: obligatorio, mínimo 6 caracteres
*/
export const createUserValidators = [
  // Validación para "nombre": quitar espacios al inicio/fin y exigir que no esté vacío
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio'),

  // Validación para "email": trim, formato de email válido
  body('email')
    .trim()
    .isEmail()
    .withMessage('El email no es válido'),

  // Validación para "contrasenia": longitud mínima
  body('contrasenia')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];