var jwt = require("jsonwebtoken");

verifyToken = function(req, res, next)
{
  const token = req.cookies.token;

  if (!token)
  {
    res.send("You are not logged in");
    return;
  }

  jwt.verify(token, process.env.SECRET_KEY, function(err, decoded)
  {
    if(err)
    {
      res.send("You are not logged in");
      return;
    }
    req.decoded = decoded;
    next();
  });
}

exports.verifyToken = verifyToken;