const express = require('express');
const app = express();
const bodyParser= require('body-parser');
var multer  = require('multer');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
const fs = require('fs');
var Promise = require('promise');
var AWS = require("aws-sdk");
var session = require('express-session');


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  
}))

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/public/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, 'prediction.jpg');
    }
  });

  //var upload = multer({ dest: __dirname+'/public/uploads/' })
var upload=multer({storage:storage});

app.get('/logout',(req,res)=>
{
  req.session.isauthenticated=false;
  res.redirect('/')

})


app.get('/login',(req,res)=>
{
  if(req.session.isauthenticated)
  {
    res.redirect('/common')
  }
  else
  {
  res.render('login.ejs');
  }
});

app.post('/login',(req,res)=>
{
  AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com	"
  });
  var docClient = new AWS.DynamoDB.DocumentClient()

  var table = "login";
  var params = {
    TableName: table,
    Key:{
        "username":'admin'
        
    }};

    docClient.get(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          
      } else {
         // console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
          dynamores= JSON.parse(JSON.stringify(data, null, 2));
          reqpassword=req.body.password;
          requsername=req.body.username;
          console.log(dynamores);
          
          dynamopass=dynamores.Item.password;
          dynamousername=dynamores.Item.username;
          console.log(requsername,reqpassword);
        
         if(dynamousername==requsername && dynamopass==reqpassword)
          {
           console.log("matched");
           console.log(requsername,reqpassword);
           req.session.isauthenticated=true;
           res.redirect("/common");

          }
          else{

            req.session.isauthenticated=false;
            res.redirect('/login');
            console.log('not matched');
          }

         
        

      }
  });
  
});


app.get('/main',(req,res)=>
{

  if(req.session.isauthenticated==true)
  {
    
    res.render('main.ejs');
  }
  else{
    res.redirect('/login');
  }
 
  

});

app.get('/common',(req,res)=>
{
  console.log(req.session);
  //res.send(req.isauthenticated);
  if(req.session.isauthenticated==true)
  {
    
    res.render('common.ejs');

  }
  else{
    res.redirect('/login');
  }
 


});
app.get('/', (req, res) => {
    
       res.render('index.ejs');
    } );

app.get('/upload',(req,res)=>
{
    res.render('upload.ejs');


});    
app.post('/profile', upload.single('avatar'), function (req, res, next) {
    //res.send(req.file);
    res.json(req.file);
    
    
  // req.file is the `avatar` file 
  // req.body will hold the text fields, if there were any 
});

app.post('/main', upload.single('avatar'), function (req, res, next) {
  //res.send(req.file);
  res.render('main.ejs');
  
  
// req.file is the `avatar` file 
// req.body will hold the text fields, if there were any 
});


 
app.post('/ajax', upload.single('avatar'),(req,res,next)=>{

 
  const { spawn } = require('child_process');
  var ls = spawn( './darknet',['detect','cfg/yolov3.cfg','yolov3.weights','/home/ttn/object-detector-with-node-js-and-yolo/public/uploads/prediction.jpg']);
  function myfunction (callback )
{
  ls.stdout.on( 'data', data => {
        console.log( `stdout: ${data}` );
        shell.cp("/home/ttn/object-detector-with-node-js-and-yolo/darknet/predictions.jpg","/home/ttn/object-detector-with-node-js-and-yolo/public/uploads");

        

        callback("done");
     
     });
    }  
  myfunction(function(returnvalue)
{

  if(returnvalue)
  {
    res.send("done");
  }
})
  
    
    ls.stderr.on( 'data', data => {
      console.error( `stdout: ${data}` );

      
   
  } );

  
  

 

  
});

    
app.get('/ajax',(req,res)=>
{
    res.render('index.ejs');
 
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
var shell = require('shelljs');

'use strict';

shell.cd('/home/ttn/object-detector-with-node-js-and-yolo/darknet');







console.log('waiting for output'+shell.pwd());

























