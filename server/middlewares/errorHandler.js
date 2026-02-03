// Error Handling Middleware
import { errorCatalogue, customError } from "../utils/errorProvider.js";

export const errorHandler = (err,req,res,next) => {

    console.error("Error: ", err.message, err.extra || 'UNKNOWN ERROR');
  // check kro error object exist krta hai to uski key lelo
  const code = err.code && errorCatalogue[err.code]? err.code : "SERVER_ERROR";
  const { message, statusCode } = errorCatalogue[code] || errorCatalogue.SERVER_ERROR;
  res.status(statusCode).json({
    success: false,
    code,
    message,
    extra: err.extra || null,
  });
  
} 



// Kaise use karna hai
// try{
//   // apna code
//   throw customError("error key from errorCatalogue of errorProvider.js");
// }catch(err){
//   // handle error using this middleware
//   errorHandler(err, req, res, next);
// }