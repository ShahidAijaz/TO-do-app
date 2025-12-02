import User from "../model/user.model.js";
import {email, z} from "zod";
import bcrypt from "bcryptjs";
const userSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username should be at least 3 characters long" }),
  password: z.string().min(6, { message: "Password should be at least 6 characters long" }),
});




export const register = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
       const validation= userSchema.safeParse({ username, email, password });
       if(!validation.success){
        //return res.status(400).json({ message: "Validation error", errors: validatio.error.errors });
       const errormessage= validation.error.errors.map((err)=>{console.log(err.message)});
         return res.status(400).json({  errors: errormessage });
       }




        const user =await User.findOne({email})
        if(user){
        return res.status(400).json({ message: "User already exists" });

}
const hashedPassword = await bcrypt.hash(password, 10);
const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
      if(newUser){
       const token =await generateTokenAndSaveInCookies(newUser._id, res);
        res.status(201).json({ message: "User registered successfully",newUser,token});
      }


}
catch (error) {
    console.log(error)
    res.status(500).json({ message: "error registering user" });
    }}
    export const login =async (req, res) => {
        const { email, password } = req.body;
        try {
            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }
        const user = await User.findOne({ email }).select("+password");
            if (!User || !(await bcrypt.compare(password, user.password))) {

                return res.status(400).json({ message: "Invalid email or password" });
            } 
              const token =await generateTokenAndSaveInCookies(user._id, res);
            res.status(200).json({ message: "User logged in successfully", user, token } );
          }
            catch (error) {
        console.log(error)
        res.status(500).json({ message: "error logging in user" });
        }}

   // console.log("login function")}

export const logout = (req, res) => {
    console.log("logout function")
}