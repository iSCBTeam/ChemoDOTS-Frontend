const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

const SERVER_PORT = 3002;

app.use(express.static("static"));

// get the index page and server index.html from static folder
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
});

app.use(bodyParser.json());
app.post("/callScript", async (req, res) => {
  const data = req.body;
  const result = await callScriptFromBackend(data); // use await keyword to wait for the function to complete
  res.send(result);
});

app.post("/CallScriptRules", async (req, res) => {
  const data = req.body;
  const result = await callScriptRuleFromBackend(data); // use await keyword to wait for the function to complete
  res.send(result);
});

app.post("/CallScriptSub", async (req, res) => {
  const data = req.body;
  const result = await callScriptSubFromBackend(data); // use await keyword to wait for the function to complete
  res.send(result);
});

app.listen(SERVER_PORT, () => {
  console.log("Server started on port", SERVER_PORT);
});

// Requires smiles in body
async function callScriptFromBackend(data) {
  const url = "http://localhost:3000/Callscript_Func";

  const response = await axios.post(url, data);
  return response.data;
}

// Requires funcname in body
async function callScriptRuleFromBackend(data) {
  const url = "http://localhost:3000/Callscript_rules";

  const response = await axios.post(url, data);
  return response.data;
}

// Requires smiles, funcname in body
async function callScriptSubFromBackend(data) {
  const url = "http://localhost:3000/Callscript_Sub";

  const response = await axios.post(url, data);
  return response.data;
}
`   `;
