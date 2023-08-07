import mongoose  from "mongoose";

export async function connect () {
    try{
        mongoose.connect(process.env.MONGO_URL!)

        const connection = mongoose.connection;
        connection.on('connected',()=>{
            console.log('connected successfully to mongo db')
        })
        connection.on('error',(err)=>{
            console.log('Mongo db connection error' + err)
            process.exit()
        })
    }catch(error){
        console.log('something went wrong');
        console.log(error)
    }
}