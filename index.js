const bodyParser = require('body-parser');
require("dotenv").config();
const express = require("express");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const objectID = new ObjectId();
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/*+json' }));


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zdy35dk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
  try {
    const db = client.db("thunk-assignment");
    const serviceCollection = db.collection("services");

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const product = await cursor.toArray();
      res.send({ status: true, data: product });
    });

         // catch single item
         app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
              const query = { _id: new ObjectId(id) }
            const note = await serviceCollection.findOne(query);
            res.send(note);
        })

        // add item 
    app.post("/services", async (req, res) => {
      const product = req.body;
      const result = await serviceCollection.insertOne(product);
      res.send(result);
    });


//     // update route
    app.put('/services/:id', async(req, res)=>{
      const id = req.params.id;
      // console.log(id)
      const updatedProducts = req.body;
      // console.log(updatedProducts);
      const filter = {_id : new ObjectId(id)};
      const options = { upsert : true };
      const updatedDoc = {
          $set : {
              name : updatedProducts.name,
              title : updatedProducts.title,
              img : updatedProducts.img,
          }
      };
      const result = await serviceCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
      });


        // delete route
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const result = await serviceCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });



  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
