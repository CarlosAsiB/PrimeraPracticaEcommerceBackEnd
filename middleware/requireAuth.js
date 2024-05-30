function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.redirect('/login');
    }
  }
  
  export default requireAuth;
  