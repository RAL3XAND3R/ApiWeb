
//Importamos nuestro nuevo pool de conexiones a la bd
import { pool } from '../db.js';

//Importamos bcrypt.js para generar hashes y comparar contraseñas
import bcrypt from 'bcryptjs';

// =============================================
// Obtener todos los usuarios
// =============================================
export const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM doc.usuarios');
  return result.rows;
};

// =============================================
// Buscar usuario por email
// =============================================
export const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM doc.usuarios WHERE email = $1', [email]);
  return result.rows;
};

// =============================================
// Buscar usuario por nombre (con LIKE)
// =============================================
export const getBuscarNombre = async (nombre) => {
  const buscar = `%${nombre}%`;
  const result = await pool.query('SELECT * FROM doc.usuarios WHERE nombre LIKE $1', [buscar]);
  return result.rows;
};

// =============================================
// Crear un nuevo usuario
// =============================================
export const postCrearUsuario = async (nombre, documento, carnet, email, contrasenia) => {
  // Número de salt rounds (cost). 10 es un valor razonable para desarrollo.
  const SALT_ROUNDS = 10;

  // Generamos el salt de bcrypt (hash salado internamente)
  // bcrypt.genSaltSync devuelve el salt de forma síncrona
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);

  // Generamos el hash a partir de la contraseña y el salt
  const contraseniaHashed = bcrypt.hashSync(contrasenia, salt);

  const query = `INSERT INTO doc.usuarios
    (nombre, documento, carnet, email, contrasenia, bloqueado, ultimo_login, activo)
    VALUES ($1, $2, $3, $4, $5, 'N', null, 'A') RETURNING *;`;
  const result = await pool.query(query, [nombre, documento, carnet, email, contraseniaHashed]);
  return result.rows[0];
};

// =============================================
// Actualizar usuario
// =============================================
export const actualizarUsuario = async (usuario) => {
  const query = `UPDATE doc.usuarios
    SET nombre=$1, documento=$2, carnet=$3, email=$4, contrasenia=$5
    WHERE id_usuario=$6
    RETURNING *;`;
  const result = await pool.query(query, usuario);
  if (result.rowCount === 0) throw new Error('Usuario no encontrado');
  return result.rows[0];
};

// =============================================
// Eliminar usuario
// =============================================
export const deleteUser = async (id_usuario) => {
  // Verificamos si el usuario existe
  const usuarioAEliminar = await pool.query('SELECT * FROM doc.usuarios WHERE id_usuario=$1', [id_usuario]);

  // Si no existe, lanzamos un error
  if (usuarioAEliminar.rowCount === 0) throw new Error('Usuario no encontrado');

  // Si existe, ejecutamos la sentencia DELETE
  const result = await pool.query('DELETE FROM doc.usuarios WHERE id_usuario=$1', [id_usuario]);

  // Confirmamos la eliminación
  return { message: 'Usuario eliminado correctamente', usuario: usuarioAEliminar.rows[0] };
};
