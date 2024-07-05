import ProductManager from '../dao/managers/ProductManager.js';

const productDao = new ProductManager();

export const getHomePage = async (req, res) => {
  try {
    const products = await productDao.getProducts();
    console.log('Productos recuperados para la página de inicio:', products);
    res.render('home', { products });
  } catch (error) {
    console.error('Error al recuperar los productos:', error);
    res.status(500).send('Error al recuperar los productos');
  }
};

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filters = query ? { $text: { $search: query } } : {};
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
    };

    const products = await productDao.getProducts(filters, options);
    const totalProducts = await productDao.countProducts(filters);
    const totalPages = Math.ceil(totalProducts / options.limit);

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${parseInt(page) + 1}&sort=${sort}&query=${query}` : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

export const getRealTimeProducts = async (req, res) => {
  try {
    const products = await productDao.getProducts();
    console.log('Productos recuperados para la vista en tiempo real:', products);
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error al recuperar los productos:', error);
    res.status(500).send('Error al recuperar los productos');
  }
};

export const addProduct = async (req, res) => {
  try {
    const product = await productDao.addProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productDao.updateProduct(req.params.id, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productDao.deleteProduct(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const product = await productDao.getProductById(req.params.id);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.render('productDetail', { product });
  } catch (error) {
    console.error('Error al recuperar el producto:', error);
    res.status(500).send('Error al recuperar el producto');
  }
};
