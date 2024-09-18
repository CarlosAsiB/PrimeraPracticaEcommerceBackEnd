// Middleware para verificar si el usuario es administrador
export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {  // Verificamos si el usuario está autenticado
    if (req.user && req.user.role === 'admin') {
      return next();  // Si es administrador, continuamos
    } else {
      return res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de administrador.' });
    }
  } else {
    return res.status(401).json({ error: 'No autenticado. Inicie sesión.' });
  }
};

// Middleware para verificar si el usuario es de rol 'user'
export const isUser = (req, res, next) => {
  if (req.isAuthenticated()) {  // Verificamos si el usuario está autenticado
    if (req.user && req.user.role === 'user') {
      return next();  // Si es usuario, continuamos
    } else {
      return res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de usuario.' });
    }
  } else {
    return res.status(401).json({ error: 'No autenticado. Inicie sesión.' });
  }
};

// Middleware para verificar si el usuario está autenticado en general
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();  // Si está autenticado, continuamos
  } else {
    return res.status(401).json({ error: 'No autenticado. Inicie sesión.' });
  }
};
