
const sessionAuth = (req, res, next) => {
    if (req.session.user) {
      req.user = req.session.user;
    }
    next();
};
  
export default sessionAuth;