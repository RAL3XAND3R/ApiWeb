// Importamos los métodos que definimos en services/usersServices.js
import * as userService from '../services/usersServices.js';

export const getObtenerTodosLosUsuarios = async (req, res, next) => {
  try {
    //Ejecutamos consulta SQL
    const result = await userService.getAllUsers();
    //Devolvemos los resultados en formato JSON
    res.json(result);
  } catch (err) {
    //En caso de error, lo pasamos a middleware de manejo de errores
    return next(err);

  }
};

export const getObtenerPorEmail = async (req,  res, next) => {
  try {
    const { email } = req.params;
    const result = await userService.getUserByEmail(email);
    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const getBuscarNombre = async (req, res, next) => {
  try {
    const { nombre } = req.params;
    const result = await userService.getBuscarNombre(nombre);
    res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const postCrearUsuario = async (req, res, next) => {
  try {
    //Extraemos los datos enviados en el body
    const { nombre, documento, carnet, email, contrasenia } = req.body;

    //Llamamos al servicio que maneja la insercion en la BD
    const newUser = await userService.postCrearUsuario(nombre, documento, carnet, email, contrasenia);

    //Respondemos con el usuario recien creado
    res.status(201).json(newUser);

  } catch (err) {
    return next(err);
  }
};

export const putActualizarUsuario = async (req, res, next) => {
  try {
    const { nombre, documento, carnet, email, contrasenia } = req.body;
    const { id_usuario } = req.params;
    const usuario = [nombre, documento, carnet, email, contrasenia, id_usuario];
    const updatedUser = await userService.actualizarUsuario(usuario);
    res.status(201).json(updatedUser);
  } catch (err) {
    return next(err);
  }
};

export const deleteEliminarUsuario = async (req, res, next) => {
  try {
    // Extraemos el id_usuario de los parámetros de la URL
    const { id_usuario } = req.params;

    // Llamamos al servicio que maneja la eliminación en la BD
    const result = await userService.deleteUser(id_usuario);

    // Respondemos con el resultado de la eliminación
    res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

