const jwt = require("jsonwebtoken");

const secretKey = "Amin-Saveh-Secret"
function GenerateRandomCode(length) {
    var result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];  
    if (!token) {
      return res.status(403).send( {
        "message" : "failed" , 
        "error"   : "A token is required for authentication"
      });
    }
    try {
        console.log(secretKey)
        console.log(token)
      const decoded = jwt.verify(token, secretKey);
      req.username = decoded.username;
    } catch (err) {
      return res.status(401).send(
        {
            "message" : "failed" , 
            "error"   : "Invalid Token"
        }
        );
    }
    return next();
  };



module.exports = {secretKey , GenerateRandomCode, verifyToken };