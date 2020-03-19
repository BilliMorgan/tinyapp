const express = require("express");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const app = express();
const PORT = 8080;
const {checkEmail, checkPassword, getID } = require('./helpers')

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
//random strng function
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
//obj with user id, names and emails
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
}
console.log(users);


app.post("/u", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL
  urlDatabase[shortURL] = longURL;
  res.redirect(`/u/`)
})


app.get("/u", (req, res) => {
  let templateVars = { urls: urlDatabase, username: users[req.cookies.user_id] };
  //console.log(users[req.cookies.user_id].email)
  res.render("urls_index", templateVars);
});

//redirection to urls_show
app.get("/u/:shortURL/update/", (req, res) => {

  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  const templateVars = { longURL, shortURL, username: users[req.cookies.user_id] }
  res.render("urls_show", templateVars)
});

app.get("/u/new", (req, res) => {
  let templateVars = { username: users[req.cookies.user_id] };
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  if (!longURL) {
    res.statusCode = 404;
    res.send(" Sorry, code 404, Page Not Found");
  } else {
    res.redirect(longURL)
  }
});





// adding delete  to the urls_index
app.post("/u/:shortURL/delete", (req, res) => {
  const del = req.params.shortURL;
  delete urlDatabase[del];
  //console.log(del);
  res.redirect("/u")
})
//adding edit option on urls_show.ejs
app.post("/u/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = req.body.longURL
  urlDatabase[shortURL] = longURL;
  res.redirect(`/u/`)
})


//adding logout feature in header
app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect(`/u/`)
})

// adding register page
app.get("/register", (req, res) => {
  res.render("urls_register", { username: req.cookies.user_id }) //why is username here??
})
//adding handling registration form
app.post("/register", (req, res) => {
  if (checkEmail(req.body.email, users) !== true) {
    const id = generateRandomString();
    const email = req.body.email;
    const password = req.body.password;
    users[id] = { id, email, password }
    res.cookie('user_id', id)
    res.redirect('/u')
  } else {
    res.statusCode = 400;
    res.send("you are dumb, proceed to login, please. Code 400")
  }
})
//adding login functionality
app.get("/login", (req, res) => {
  res.render("urls_login", { username: req.cookies.user_id })
})
//adding login feature in header
app.post("/login", (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;

  if(getID(email, password, users) !== false){
    res.cookie('user_id', getID(email, password, users))
    res.redirect('/u')
  } else {
    res.statusCode = 403;
    res.send("no such users or passwords have been registerred. Code 403")//nned features to indicate that pasword 
  }
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});