import bcrypt from "bcrypt";
const bcryptUtil = async (pass) =>{
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pass,salt)
      return hash;
    } catch (error) {
      throw error;
    }
}
export default bcryptUtil;