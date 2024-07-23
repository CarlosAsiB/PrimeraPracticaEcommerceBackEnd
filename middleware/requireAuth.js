export default function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log('User not authenticated, redirecting to /login');
    return res.redirect('/login');
  }
}