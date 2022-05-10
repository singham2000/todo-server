const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const res = require("express/lib/response");
const app = express();

app.use(cors());
app.use(express.json());
const uri =
    "mongodb://localhost:27017";
const client = new MongoClient(uri);
const database = client.db('todo');
const todos = database.collection("todo");
async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.post("/add", async (req, res) => {
    const head = req.body.head;
    const desc = req.body.desc;
    const doc = { head, desc, status: "In-Complete" };
    const result = await todos.insertOne(doc);
    console.log(
        `A document was inserted with the _id: ${result.insertedId}`,
    );
    res.send("true");
})

app.post("/del", async (req, res) => {
    const id = req.body.id;
    console.log(id);
    var myquery = { _id: ObjectId(id) };
    todos.deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
    })
    res.send("true");
})

app.post("/comp", async (req, res) => {
    const id = req.body.id;
    console.log(id);
    var myquery = { _id: ObjectId(id) };
    var newvalues = { $set: { status: "Complete" } };

    todos.updateOne(myquery, newvalues, function (err, obj) {
        if (err) throw err;
        console.log("1 document update");
    })
    res.send("true");
})

app.post("/update", async (req, res) => {
    const id = req.body.id;
    const head = req.body.head;
    const desc = req.body.desc;
    console.log(id);
    var myquery = { _id: ObjectId(id) };
    var newvalues = { $set: { head: head, desc: desc, status: "In-Complete" } };
    todos.updateOne(myquery, newvalues, function (err, obj) {
        if (err) throw err;
        console.log("1 document update");
        console.log(obj);
    })
    res.send("true");
})

app.post("/comment", async (req, res) => {
    const id = req.body.id;
    const cmnt = req.body.cmnt;
    console.log(id);
    var myquery = { _id: ObjectId(id) };
    var newvalues = { $set: { cmnt } };
    todos.updateOne(myquery, newvalues, function (err, obj) {
        if (err) throw err;
        console.log("1 document update");
        console.log(obj);
    })
    res.send("true");
})

app.get("/getAll", async (req, res) => {
    const cursor = await database.collection("todo").find({})
    const results = await cursor.toArray();
    res.send(results);
})

app.listen(3000, () => {
    console.log("running");
});
