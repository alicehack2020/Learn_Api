import UserModel from "../model/User.js";
import bcrypt from "bcrypt"
import Jwt  from "jsonwebtoken";

class UserController{
   
    static userRegistration=async(req,res)=>{
        const {name,email,password,password_confirmation,tc}=req.body;
        
        const user=await UserModel.findOne({email:email})

        if(user)
        {
            res.send({"status":"failed","message":"Email already taken"})
        }
        else
        {
            if(name&&email&&password&&password_confirmation&&tc)
            {
              if(password===password_confirmation)
              {
                   try {
                    
                    const salt=await bcrypt.genSalt(12)
                    const hashPassword=await bcrypt.hash(password,salt)
                    const doc=new UserModel({
                      name:name,
                      email:email,
                      password:hashPassword,
                      tc:tc  
                    })

                    await doc.save()
                    res.send({"status":"success","message":"registration successfully"})


                   } catch (error) {
                    res.send({"status":"failed","message":"unable to register"})
                   }
              } 
              else{
                res.send({"status":"failed","message":"password and confirm password doesn't match"})
              }
            }
            else{
                res.send({"status":"failed","message":"all fields are required"})
            }
        }

    }
}

export default UserController;