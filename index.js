const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cazfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        //console.log("data connected");
        const database = client.db("OakTour");
        const tourCollection = database.collection("tours");
        const hotelCollection = database.collection("hotels");
        const restaurantsCollection = database.collection("restaurants");

        //POST API
        app.post('/tours', async (req, res) => {
            const tour = req.body;
            const result = await tourCollection.insertOne(tour);
            res.json(result);
        });
        app.post('/hotels', async (req, res) => {
            const hotel = req.body;
            const result = await hotelCollection.insertOne(hotel);
            res.json(result);
        });
        app.post('/restaurants', async (req, res) => {
            const restaurant = req.body;
            const result = await restaurantsCollection.insertOne(restaurant);
            res.json(result);
        });

        //GET API
        app.get('/tours', async (req, res) => {
            const cursor = tourCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        });
        app.get('/hotels', async (req, res) => {
            const cursor = hotelCollection.find({});
            const hotels = await cursor.toArray();
            res.send(hotels);
        });
        app.get('/restaurants', async (req, res) => {
            const cursor = restaurantsCollection.find({});
            const restaurants = await cursor.toArray();
            res.send(restaurants);
        });

        // Get Single
        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tour = await tourCollection.findOne(query);
            res.json(tour);
        });
        app.get('/hotels/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const hotel = await hotelCollection.findOne(query);
            res.json(hotel);
        });
        app.get('/restaurants/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const restaurant = await restaurantsCollection.findOne(query);
            res.json(restaurant);
        });
    }
    finally {
        //await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome To OakTour Server')
})

app.listen(port, () => {
    console.log(`Example app listening a http://localhost:${port}`)
})