

// =============================================
// Middleware centralizado para manejo de errores
// =============================================

export const errorHandler = (err, req, res, next) => {
  // Mostramos el error en consola para depurar
  console.error(err);

  // Si el error tiene un status definido, lo usamos. Si no, asumimos 500
  const statusCode = err.statusCode || 500;

  // Si el error tiene un mensaje definido, lo usamos. Si no, mensaje genérico
  const message = err.message || 'Error interno del servidor';

  // Respondemos con un JSON uniforme
  res.status(statusCode).json({
    status: 'error',
    message
  });
};

