import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';
import cors from 'cors';

const app = express() 
const PORT = 8000

app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB()

const db = mongoClient.db("studio-space")
const collection = db.collection("destination")
const bookingcollections =db.collection("booking")

app.post('/create-studio',async(req,res) => {

    const data = req.body

    const result =await collection.insertOne(data)
    res.send(result)
})
app.get('/destination',async(req,res) => {
    const result = await collection.find().toArray()
    res.send(result)
})
app.get('/destination/:id',(req,res,next) => {
  const authHeader = req.headers.authorization

  if(authHeader === "user Logged in") {
    return res.status(401).send({msg:'Unauthorized'})
  }
   console.log(" i am middle")
  next();
},async(req,res) => {
  const {id} = req.params
  const result = await collection.findOne({_id:new ObjectId(id)})
  res.send({result})
})
app.post('/booking', async(req,res) => {
  const data = req.body
  const result = await bookingcollections.insertOne(data)
  res.send(result)
})

app.get('/my-booking/:email',async(req,res) => {
  const {email} = req.params
  const result =await bookingcollections.find({email:email}).toArray()
  res.send(result)
})

app.get('/', (req,res) => {
    res.send({message:'Server is running fine!'})

})

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})
