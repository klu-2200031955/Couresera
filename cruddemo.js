const express = require("express")
const {MongoClient} = require("mongodb")
const app = express()
app.use(express.json()) //to pass the json data


const dburl = "mongodb://localhost:27017"
const dbname = "restdemo32"   


const client = new MongoClient(dburl)  //creating a client variable
client.connect().then(() => {
    console.log("Connected to DB Successfully")
}).catch((err) => {
    console.log(err.message)
});


const db = client.db(dbname) //creating db variable

app.post("/addstudent", async (request,response)=>{
    try {
        const s = await request.body
        db.collection("student").insertOne(s)
        response.send("Student Inserted Successfully")
    } catch (e) {
        // console.log(e.message)
        response.status(500).send(e.message)
    }
})


app.get("/viewstudents", async (request,response)=>{
    try {
        const students =await db.collection("student").find().toArray()
        response.json(students)
    } catch (e) {
        // console.log(e.message)
        response.status(500).send(e.message)
    }
})

app.delete("/deletestudent/:id", async (request,response)=>{
    try {
        const id = request.params.id
        const id1 = parseInt(id)
        const student = await db.collection("student").findOne({"sid":id1})
        if(student!=null){
            db.collection("student").deleteOne({sid:id1})
            response.send("Student Deleted Successfully")
        }else{
            response.send("Student ID Not Found")
        }

    } catch (e) {
        // console.log(e.message)
        response.status(500).send(e.message)
    }
})

app.get("/studentbyid/:id", async (request,response)=>{
    try {
        const id = await request.params.id
        const id1 = parseInt(id)
        const student = await db.collection("student").findOne({sid:id1})
        if(student){
            response.json(student)
        }else{
            response.send("Student ID Not Found")
        }
    } catch (e) {
        // console.log(e.message)
        response.status(500).send(e.message)

    }
})

app.put("/updatestudent",async (request,response) =>{
    try {
        const s = await request.body  //json data
        console.log(s) //sid sname sage 
        const student = await db.collection("student").findOne({"sid":s.sid})
        if(student!=null){
            db.collection("student").updateOne({"sid":s.sid},{$set:{"sname":s.sname,"sage":s.sage}})
            response.send("Student Updated Successfully")
        }else{
            response.send("Student ID Not Found")
        }
    } catch (e) {
        // console.log(e.message)
        response.status(500).send(e.message)
    }
})

const port = 2032
app.listen(port,()=>{
    console.log("Server is running at port: "+port)
})