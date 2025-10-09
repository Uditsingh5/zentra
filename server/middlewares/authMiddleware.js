import jwt from "jsonwebtoken";

// errorHandler imports
import { customError } from "../utils/errorProvider.js";
import { errorHandler } from "../middlewares/errorHandler.js";

const verifyJwt = (req,res,next) => {
    const token = req.header('Authorization')?.split(" ")[1];
    
    if(!token){
      // return res.sendStatus(401);
      throw customError("UNAUTHORIZED");
    }
    try{
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      
      req.userId = decoded?.sub ?? decoded?.user ?? decoded?.id ?? decoded;
      if(!req.userId){
        // return res.sendStatus(401);
        throw customError("UNAUTHORIZED");
      }
      next();
    }catch(err){
      // return res.sendStatus(401);
      errorHandler(err, req, res, next);
    }
}

export default verifyJwt;