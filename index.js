import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT;



app.use(express.json());


const MONGO_URL = process.env.MONGO_URL;

async function createConnection(){
    const client =  new MongoClient(MONGO_URL) 
    await client.connect();  
    console.log("Mongodb Connected");
    return client;
}
const client = await createConnection();

const details = "hello san"

// const mentorList = [{
//     "id":"100",
//     "mentor": "jenni"
// }]

app.get("/",(request,response)=>{
    response.send(details);
});

app.get("/mentorlist",async (request,response)=>{
    const mentorList = await client 
    .db("b28wd")
    .collection("mentors")
    .find({})
    .toArray();
    response.send(mentorList);
});
app.post("/mentorlist", async (request,response)=>{
    const data = request.body;
    const result = await createMentors(data);
    response.send(result);
    });

    async function createMentors(data) {
        return await client.db("b28wd").collection("mentors").insertOne(data);
    }

app.listen(PORT,()=>console.log("App is started in", PORT));