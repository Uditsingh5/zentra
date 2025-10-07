import jwt from "jsonwebtoken";


const verifyJwt = (req,res,next) => {
    const token = req.header('Authorization')?.split(" ")[1];
    
    if(!token){
      return res.sendStatus(401);
    }
    try{
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      
      req.userId = decoded?.sub ?? decoded?.user ?? decoded?.id ?? decoded;
      if(!req.userId){
        return res.sendStatus(401);
      }
      next();
    }catch(err){
      return res.sendStatus(401);
    }
}

export default verifyJwt;