const express=require('express');
const app=express();
const cors=require('cors');
const { CURSOR_FLAGS, ObjectId } = require('mongodb');
const port=process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');



// midleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n6usyvo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection=client.db('hungryHaat').collection('menu');
    const reviewsCollection=client.db('hungryHaat').collection('reviews');
    const cartCollection=client.db('hungryHaat').collection('carts');


    // for all menu item get api

    app.get('/menu',async(req,res)=>{
        const result=await menuCollection.find().toArray();
        res.send(result);
    });
    app.get('/reviews',async(req,res)=>{
        const result=await reviewsCollection.find().toArray();
        res.send(result)
    });
    // carts related api hare
    app.post('/carts',async(req,res)=>{
      const cartItem=req.body;
      const result=await cartCollection.insertOne(cartItem);
      res.send(result);
    });

  
    app.get('/carts', async (req, res) => {
      const email=req.query.email;
      const query={email:email}
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.delete('/carts/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result=await cartCollection.deleteOne(query);
      res.send(result);


    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Hungry lagtece khub kahbo ami')
});

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})
