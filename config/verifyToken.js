const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  console.log(bearerHeader);
  if (bearerHeader === undefined) {
    console.log("Not authorized");
  }

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    console.log(req.token);

    jwt.verify(req.token, process.env.SECRET, (err, authData) => {
      if (err) return res.status(403).json(err);
      req.authData = authData;
      next();
    });
  }
};

module.exports = verifyToken;
