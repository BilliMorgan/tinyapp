const express = require("express");
const bodyParser = require("body-parser")

const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
const generateRandomString = () => {
  let randomKey = "";
  for (let i = 0; i < 6; i++) {
    const randomCase = randomNum(0, 3);
    if (randomCase === 0) {
      randomKey += randomNum(0, 9);
    } else if (randomCase === 1) {
      randomKey += String.fromCharCode(randomNum(65, 90));
    } else {
      randomKey += String.fromCharCode(randomNum(97, 122));
    }
  }
  return randomKey;
};


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.post("/urls", (req,res) => {
  console.log(req.body);
  res.send("Ok")            //needs to replace this
})
app.get("/",(req,res) => {
res.send("Hello");
});
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req,res) => {                                                                //get  urls/new
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req,res) => {
  let templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] }; //need to check urlDatabase ???
  res.render("urls_show", templateVars)
})
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});
app.get("/set",(req,res) => {
  const a = 1;
  res.send(`a = ${a}`);
})

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`)
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});