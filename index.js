const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000;
require('dotenv').config()

app.use(cors());
app.use(express.json())

const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
app.get('/' ,  (req,res) =>{
  res.send('server is running !')
})

// mongodb
const uri = process.env.MONGO_DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
   const database = client.db("hireloop_db")
   const jobCollection = database.collection("job")
   const companyCollection =  database.collection("company")
   

   app.get("/api/jobs" , async(req,res)=>{
        const query = {} ;
        if(req.query.companyId){
          query.companyId = req.query.companyId;
        }

        if(req.query.status){
          query.status =  req.query.status
        }
         const cursor = jobCollection.find(query);
         const result = await cursor.toArray();
         res.send(result)
    })
   
   app.post("/api/jobs" , async(req,res)=>{
         const job = req.body ;
         const result = await  jobCollection.insertOne(job);
         res.send(result)
   })

  //  company related api post
   app.post("/api/companies", async (req, res) => {
  try {
    const company = req.body;
    // মঙ্গোডিবি কালেকশনে ডাটা ইনসার্ট করা হচ্ছে
    const result = await companyCollection.insertOne(company);
    res.status(201).send(result);
  } catch (error) {
    console.error("Express Error:", error);
    res.status(500).send({ success: false, message: "Database insertion failed" });
  }
});  

// compani get api
 app.get("/api/my/companies" , async(req,res)=>{
        const query = {} ;
        if(req.query.recruiterId){
          query.recruiterId = req.query.recruiterId;
        }

        if(req.query.status){
          query.status =  req.query.status
        }
         const cursor = companyCollection.find(query);
         const result = await cursor.toArray();
         res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








// status
app.listen(port,() =>{
  console.log(`server is running ${port}`)
})