import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

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

const details = "hello world!!!, for getting mentor and students details ( /mentorlist )"

// const mentorList = [{
//     "id":"100",
//     "mentor": "jenni"
//     "student" : "san"
// }]

app.get("/",(request,response)=>{
    response.send(details);
});

app.get("/onlymentorlist",async (request,response)=>{
    const onlyMentorList = await client 
    .db("b28wd")
    .collection("onlymentors")
    .find({})
    .toArray();
    response.send(onlyMentorList);
});

app.post("/onlymentorlist", async (request,response)=>{
    const data = request.body;
    const result = await createMentorsOnly(data);
    response.send(result);
    });

    app.get("/onlystudentslist",async (request,response)=>{
        const onlyStudentsList = await client 
        .db("b28wd")
        .collection("onlystudents")
        .find({})
        .toArray();
        response.send(onlyStudentsList);
    });

    app.post("/onlystudentslist", async (request,response)=>{
        const data = request.body;
        const result = await createStudentsOnly(data);
        response.send(result);
        });


app.get("/mentorlist",async (request,response)=>{
    const mentorList = await client 
    .db("b28wd")
    .collection("mentors")
    .find({})
    .toArray();
    response.send(mentorList);
});

app.get("/mentorlist/:id",async (request,response)=>{
    console.log(request.params);
    const {id} = request.params;
	const mentorById = await getMentorsById(id)
    console.log(mentorById);

    mentorById? response.send(mentorById) : response.status(404).send({message:"no matching movie found"});
});


app.post("/mentorlist", async (request,response)=>{
    const data = request.body;
    const result = await createMentors(data);
    response.send(result);
    });

    app.put("/mentorlist/:id", async (request,response)=>{
        console.log(request.params);
        const {id} = request.params;
        const data = request.body;
        const result = await editMentorsById(id, data);
        const mentor = await getMentorsById(id);
        console.log(result);
        response.send(mentor);
    });
    
    async function editMentorsById(id, data) {
        return await client
            .db("b28wd")
            .collection("mentors")
            .updateOne({ _id: ObjectId(id) }, { $set: data });
    }
    

    async function createMentors(data) {
        return await client.db("b28wd").collection("mentors").insertOne(data);
    }
    async function createMentorsOnly(data) {
        return await client.db("b28wd").collection("onlymentors").insertOne(data);
    }
    async function createStudentsOnly(data) {
        return await client.db("b28wd").collection("onlystudents").insertOne(data);
    }
    async function getMentorsById(id) {
        return await client
            .db("b28wd")
            .collection("mentors")
            .findOne({ _id: ObjectId(id) });
    }


app.listen(PORT,()=>console.log("App is started in", PORT));