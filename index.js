const express = require('express')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yqpoa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()


app.use(bodyParser.json());
app.use(cors());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const foodsCollection = client.db("hotOnionRestaurantCheap").collection("foods");

    app.post('/addFood', (req, res) => {
        const food = req.body;
        console.log(food);
        foodsCollection.insertOne(food)
            .then(result => {
                //   console.log(result);
                res.send(result.acknowledged)
            })
    })

    app.get('/foods', (req, res) => {
        foodsCollection.find({})
        .toArray((err, foods) =>{
            res.send(foods)
        })
    })

    app.get('/food/:key', (req, res) => {
        foodsCollection.find({key: req.params.key})
        .toArray((err, food) =>{
            // console.log(food[0]);
            res.send(food[0])
        })
    })
    
    app.post('/foodsByKey', (req, res) => {
        const foodKeys = req.body;
        foodsCollection.find({ key: { $in: foodKeys } })
        .toArray((err, document) => {
            res.send(document);
            // console.log(document);
        })
    })
});

const port = 5000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})