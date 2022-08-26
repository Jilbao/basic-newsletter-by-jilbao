//Express module
const { json } = require("express");
const express = require("express");
const app = express();
const port = process.env.PORT;
//HTTPS
const https = require("node:https");
//Mailchimp
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
    apiKey: "##########",
    server: "####",
  });

//Listen
app.listen(port || 3000, ()=>{
    console.log(`Server is on! Port: ${port}`);
});

//Static
app.use(express.static("public"));

//Body and JSON Parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Index
app.get("/", (req, res)=>{

    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {

    const listId = "####";
    const subscribingUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
    };

    const run  = async () => {
      try {
        await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
          }
        });
        
        res.sendFile(__dirname + "/success.html");
      } catch (e) {
        console.log(e.status);
        res.sendFile(__dirname + "/failure.html");
      }
          
      };

    
    run();
    
});

