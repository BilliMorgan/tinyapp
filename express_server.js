const express = require("express");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const app = express();
const PORT = 8080;
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
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

//obj with shortnames
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL
  urlDatabase[shortURL] = longURL;

  //console.log(urlDatabase);
  res.redirect(`/urls/`)            
})


app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };

  res.render("urls_index", templateVars);
});

//redirection to urls_show
app.get("/urls/:shortURL/update/", (req, res) => {

  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  const templateVars = { longURL, shortURL, username: req.cookies["username"]  }
  res.render("urls_show", templateVars)
});

app.get("/urls/new", (req, res) => { 
  let templateVars = { username: req.cookies["username"] };                                                          
  //get  urls/new
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  if (!longURL) {
    res.statusCode = 404;
    res.send(" Sorry, code 404, Page Not Found");
  } else {
    // let templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
    //  res.render("urls_show", templateVars)
    res.redirect(longURL)
  }


});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// adding delete  to the urls_index
app.post("/urls/:shortURL/delete", (req, res) => {
  const del = req.params.shortURL;
  delete urlDatabase[del];
  //console.log(del);
  res.redirect("/urls")
})
//adding edit option on urls_show.ejs
app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = req.body.longURL
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/`)
})
//adding login feature in header
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username)
  console.log(req.body.username)
  res.redirect(`/urls/`)
})

//adding logout feature in header
app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect(`/urls/`)
})



app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});
app.get("/", (req, res) => {
  res.send("Hello");
});
app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`)
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});