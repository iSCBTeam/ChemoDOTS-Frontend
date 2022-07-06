// we create the web server on port 3000
const express = require ('express');
const app = express ();
const port = process.env.PORT || 3000;

// body-parser allows you to easily retrieve the data passed in POST.
// The Angular application send its data in JSON format, so we have to ask
// to the body parser to parser only this format.
const bodyParser = require ('body-parser');
app.use(bodyParser.json());

// For CORS
const cors = require ('cors');
app.use(cors({origin: 'http://localhost:4200', credentials: true}));
//app.use(cors({origin: 'http://10.36.4.65:4200', credentials: true}));
//app.use(cors({origin: 'http://127.0.0.1:4200', credentials: true}));



// here, we set up the routes that will be served by the web server:
// each route corresponds to a file that we load via a require. This
// file just exports a function, which is called when the user
// ask to access the route.
const Callscript_Func = require ('./Callscript_Func');
const Callscript_rules = require ('./Callscript_rules');
const Callscript_Sub = require ('./Callscript_Sub');


app.post ('/Callscript_Func', (req, res) => {Callscript_Func(req,res);});
app.post ('/Callscript_rules', (req, res) => {Callscript_rules(req,res);});
app.post ('/Callscript_Sub', (req, res) => {Callscript_Sub(req,res);});

app.listen(port, () => {console.log (`listening on port ${port}`)});
