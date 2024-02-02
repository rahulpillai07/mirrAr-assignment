import "dotenv/config";
import connectDB from './dbConfig/dbConfig';
import { app } from './app';
import { Product } from "./models/products.model";



connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server running on port ${process.env.PORT!}`);
    })
})
.catch((err)=>{
    console.log('MongoDB connection failed',err);
})
