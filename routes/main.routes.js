import { Router } from "express";
import { productModel } from "../models/product.js";
import { hash, compare } from 'bcrypt';
import { userModel } from "../models/user.js";
import jwt from 'jsonwebtoken';
const mainRouter = Router();


mainRouter.get('/products', async(req,res)=>{

    try {
        const data = await productModel.find();
        const count = await productModel.count();
        
        if(count > 0){
            res.json(data);
           
        }
        else {
            res.json({message: "No products found"});
        }
        res.end();
    }
    catch(err) {
        console.log(err);
    }
   
});


mainRouter.get('/products/:id', async(req,res)=>{

    try {

        let productId= req.params.id;
        // 64e22a06f97d37f307defd5f
        const data = await productModel.findById({ _id: productId });
        
        if(data){
            res.json(data);
        }
        else {
            res.json({message: "No product with specified id was found"});
        }
        res.end();
    }
    catch(err) {
        console.log(err);
    }
   
});


mainRouter.post('/register', async(req,res)=>{
    const {username, email, password} = req.body; 
    console.log(req.body);
    const encryptedPassword = await hash(password, 10);

    try {
        const user = await userModel.create({
            username,
            email,
            password: encryptedPassword
        });

        res.status(201).json({ user});
        res.end();

    }
    catch(err) {0
        console.log(err);
        res.json({message: err});
        res.end();
    }
});


mainRouter.post('/login', async(req,res)=>{
    
    const {username, password} = req.body;

    
    try{
        const user = await userModel.findOne({username});

        if(!user) {
            res.status(401).json({message: "User not found"});
            res.end();
        }

        const isPasswordValid = await compare(password, user.password);

        if(!isPasswordValid){
            res.status(401).json({message:"Unauthorized, invalid credentials"});
            res.end();
        }


        const token = jwt.sign({userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({token: token });
        res.end();

    }
    catch(err) {
        console.log(err);
    }

});


export default mainRouter;