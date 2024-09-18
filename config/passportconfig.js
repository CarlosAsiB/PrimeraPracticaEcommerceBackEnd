import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import bcrypt from 'bcryptjs';
import User from '../dao/models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Estrategia local para autenticación por nombre de usuario y contraseña
passport.use(new LocalStrategy({
  usernameField: 'username',  // Campo utilizado para el nombre de usuario
  passwordField: 'password'   // Campo utilizado para la contraseña
}, async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Estrategia de GitHub para autenticación
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/api/sessions/githubcallback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Buscar usuario por GitHub ID
    let user = await User.findOne({ githubId: profile.id });
    
    if (!user) {
      // Si el usuario no existe, crear uno nuevo con los datos de GitHub
      user = new User({
        username: profile.username || profile.displayName,  // Usar username o displayName si está disponible
        githubId: profile.id,
        first_name: profile.displayName || 'GitHub User',  // Fallback a 'GitHub User' si no hay displayName
        email: profile.emails?.[0]?.value || '', // Obtener email si está disponible en el perfil
        role: 'user'  // Asignar rol 'user' por defecto
      });
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serializar el usuario para almacenarlo en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);  // Almacenar solo el ID del usuario
});

// Deserializar el usuario desde la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);  // Recargar la información del usuario
  } catch (err) {
    done(err, null);
  }
});

export default passport;
