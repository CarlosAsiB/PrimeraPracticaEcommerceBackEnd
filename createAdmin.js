import mongoose from 'mongoose';
import User from './dao/models/userModel.js';  // Ajusta la ruta si es necesario
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
    });

    const adminExists = await User.findOne({ email: 'admin@example.com' });

    if (adminExists) {
      console.log('El administrador ya existe');
      return;
    }

    const newAdmin = new User({
      first_name: 'Admin',
      last_name: 'User',
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'yourpassword',
      role: 'admin' 
    });

    await newAdmin.save();
    console.log('Administrador creado exitosamente');
  } catch (error) {
    console.error('Error al crear el administrador:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
