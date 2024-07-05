export default function requireAuth(req, res, next) {
  console.log("Checking authentication status...");
  console.log("User authenticated:", req.isAuthenticated());

  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log("User not authenticated, redirecting to /login");
    res.redirect('/login');
  }
}
