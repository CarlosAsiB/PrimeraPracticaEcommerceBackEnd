import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from './dao/models/productModel.js'; 

// Cargar variables de entorno
dotenv.config();

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
        migrateProducts();
    })
    .catch(err => {
        console.log('Error de conexión a MongoDB:', err);
    });

const migrateProducts = async () => {
    try {
        const data = fs.readFileSync('./products.json', 'utf8'); 
        const { products } = JSON.parse(data); // Desestructura el array de productos del objeto JSON

        for (const product of products) {
            // Verifica si faltan campos obligatorios y muestra una advertencia en esos casos
            const { title, description, code, price, stock, category } = product;
            if (!title || !description || !code || !price || !stock || !category) {
                console.warn(`Saltando producto con campos obligatorios faltantes: ${JSON.stringify(product)}`);
                continue;
            }

            // Maneja las claves duplicadas
            try {
                await ProductModel.create(product);
            } catch (error) {
                if (error.code === 11000) {
                    console.warn(`Error de clave duplicada para el código: ${product.code}, actualizando el producto existente`);
                    await ProductModel.findOneAndUpdate({ code: product.code }, product, { new: true });
                } else {
                    throw error;
                }
            }
        }

        console.log('Productos migrados exitosamente a MongoDB');
    } catch (error) {
        console.error('Error al migrar los productos:', error);
    } finally {
        mongoose.disconnect();
    }
};
