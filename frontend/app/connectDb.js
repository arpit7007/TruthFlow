import mongoose from "mongoose";

const connectDb = async () => {
    try{
        const con = await mongoose.connect(process.env.URI)
        console.log('Connected to MongoDB', con.connection.host)
    }
    catch(err){
        console.log("ERROR:", err)
    }
}

export default connectDb;