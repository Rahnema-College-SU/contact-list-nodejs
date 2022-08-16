const express = require('express'); 
const jwt = require("jsonwebtoken");
const app     = express()
const {secretKey,GenerateRandomCode ,verifyToken} = require("./auth");
const db   = require("./models")
const bodyParser = require('body-parser'); // middleware
const Users = db.users;
const UserContacts = db.usercontacts
const Contacts = db.contacts
const Op = db.Sequelize.Op;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


const port = 8080 // Port we will listen on

app.post('/api/v1/signup',  async (req,res) => {
    const user  = await Users.findOne({where : { username : req.body.username}})
    if(user){
        
        if(user.password === req.body.password){
            const token = jwt.sign({ username : req.body.username},secretKey,);
            res.status(200).send(
                {
                    success : true,
                    token   : token
                })
                return
        }else{
            res.status(403).send({
                success : false,
                message :  "Username Or Password Is Not Valid"
              });
              return
        }
    }
        const newUser = {
            username : req.body.username,
            password : req.body.password,
            phone : req.body.phone,
        }
        await Users.create(newUser).then(data => {
            const token = jwt.sign({ username : req.body.username},secretKey);
            res.status(200).send(
                {
                    success : true,
                    token   : token
                })
                return

        }).catch(err => {
            res.status(403).send({
                success : false,
                message :  "Username Or Password Is Not Valid"
              });
              return
        })
})

app.post('/api/v1/addContact', verifyToken ,async (req,res) => {

    let contact  = await Contacts.findOne({where : { phone : req.body.phone}})
    const user     = await Users.findOne({where : { username : req.username}})
    if(!contact){
        const newContact = {phone : req.body.phone}
        contact = await Contacts.create(newContact)
    }
    await user.addContact(contact, {through : {name : req.body.name}}).then(_ => {

        res.status(200).send({
            success : true,
          });
          return

    }).catch(err => {
        res.status(403).send({
            success : false,
            message :  "Internal Server Error"
          });
          return
    })
})




app.get('/api/v1/getContacts', verifyToken ,async (req,res) => {
    const user  = await Users.findOne({where : { username : req.username}})
    let data = await Users.findOne({include :  {model : Contacts}})
    console.log(data)
})


app.put('/api/v1/update', verifyToken ,  async (req,res) => {
   await Users.findOne({where : {phone : req.phone}}).then( user => {
    if(!user){
        res.status(400).send(
            {
                "message" : "failed",
                "error "  : "User Not Found!"
            }
            )
            return
    }
    let updatedValues = {
        phone     : user.phone,
        firstname : req.body.firstName,
        lastname  : req.body.lastName,
        code      : user.code
    }
        user.update(updatedValues).then(updatedUser => {
        res.status(200).send(
            {
                "message" : "successful",
                "token"   : updatedUser
            }
            )
            return
    }).catch(err => {
        res.status(400).send(
            {
                "message" : "failed",
                "error "  : err
            }
            )
            return
    })
   }
   )
})







// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));




