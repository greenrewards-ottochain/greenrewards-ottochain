const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
require("dotenv").config();
const secret = process.env.MY_SECRET;

// Middleware: Require Authentication
const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;

  try {
    // Verify if JWT exists
    if (token) {
      const decodedToken = jwt.verify(token, secret);
      // Attach user information to request object
      req.user = decodedToken;
      next();
    } else {
      throw new Error("No token");
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

// // Middleware: sellers Authorization
// const authorizeSeller = async (req, res, next) => {
//   const token = req.headers.authorization.split(" ")[1];

//   try {
//     if (token) {
//       const decodedToken = jwt.verify(token, secret);
//       // Attach user information to request object
//       req.user = decodedToken;
//     } else {
//       throw new Error("No token");
//     }
//     // Retrieve user information from the attached token
//     const user = await User.findById(req.user.id);
//     if (user.role !== "seller") {
//       return res.status(403).json({
//         message: "Only sellers can access this resource",
//       });
//     }
//     next();
//   } catch (error) {
//     console.error("Error checking admin authorization", error);
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

// //Middleware: buyers Authorization
// const authorizeBuyer = async (req, res, next) => {
//   const token = req.headers.authorization.split(" ")[1];

//   try {
//     if (token) {
//       const decodedToken = jwt.verify(token, secret);
//       // Attach user information to request object
//       req.user = decodedToken;
//     } else {
//       throw new Error("No token");
//     }
//     // Retrieve user information from the attached token
//     const user = await User.findById(req.user.id);
//     if (user.role !== "buyer") {
//       return res.status(403).json({
//         message: "Only buyers can access this resource",
//       });
//     }
//     next();
//   } catch (error) {
//     console.error("Error checking buyer authorization", error);
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

module.exports = {requireAuth};
