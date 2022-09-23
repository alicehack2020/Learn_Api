import UserModel from "../model/User.js";
import bcrypt from "bcrypt"
import Jwt  from "jsonwebtoken";

class UserController{
   
  //register
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
                    const user=await UserModel.findOne({email:email})
                    const token=Jwt.sign({userID:user._id},
                      process.env.JWT_SECRET_KEY,{expiresIn:"5d"})


                    res.send({"status":"success","message":"registration successfully","token":token})


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


    //login
    static userLogin=async(req,res)=>{
      const {email,password}=req.body;
      if(email&&password)
      {
        const user=await UserModel.findOne({email:email})
        if(user!=null)
        {
          const isMatch=await bcrypt.compare(password,user.password)
          if(isMatch && (email===user.email))
          {
             //const user=await UserModel.findOne({email:email})
              const token=Jwt.sign({userID:user._id},
              process.env.JWT_SECRET_KEY,{expiresIn:"5d"})

            res.send({"status":"success","message":"login success","token":token})

          }
          else{
            res.send({"status":"failed","message":"email or password incorrect"})
 
          }

        }
        else{
          res.send({"status":"failed","message":"please register"})

        }
      }
      else{
        res.send({"status":"failed","message":"all field are required"})
      }
    }
}

export default UserController;