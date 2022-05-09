const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const res = require('express/lib/response');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.ryy0z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const productCollection = client.db(`green2424`).collection('products');
        const totalCollection = client.db(`green2424`).collection('total');
        console.log(`DB Connected`);
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/product', async (req, res) => {
            const id = (req.query.id);
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send({ result });
        })
        app.delete('/product', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        // remove quantity
        app.put(`/product`, async (req, res) => {
            const id = req?.body?.id;
            console.log(id);
            const quantity = req?.body?.quantityChange;
            console.log('qty:', quantity);
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity,

                },
            };
            const result = await productCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })

        // Total Collection CLuster
        app.get('/total', async (req, res) => {
            const id = (req.query.id);
            const query = {};
            const result = await productCollection.find(query);
            res.send({ result });

        })

    }

    finally {

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);

})
