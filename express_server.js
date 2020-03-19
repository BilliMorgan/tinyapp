const express = require("express");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const app = express();
const PORT = 8080;
const { checkEmail, checkPassword, getID, generateRandomString } = require('./helpers')
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


//obj with shortnames
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "aJ48lW" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "aJ48lW" }
};

//obj with user id, names and emails
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "test": {
    id: "test",
    email: "test1@t.ca",
    password: "123"
  }
};
//function which create a new obj with URL which belong only to certain userID
const urlsForUser = (id, urlDatabase) => {
  const ObjUserID = {};
  for (shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      ObjUserID[shortURL] = urlDatabase[shortURL]
    }
  }
  return ObjUserID;
};

//index page
app.get("/u", (req, res) => {
  let cookiesID = req.cookies.user_id;
  if (cookiesID !== undefined) {
    const userURLs = urlsForUser(cookiesID, urlDatabase);
    let templateVars = { urls: userURLs, username: users[req.cookies.user_id] };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login")
  }
});

//creating userID and short link
app.post("/u", (req, res) => {
  let cookiesID = req.cookies.user_id;
  if (cookiesID === undefined) {
    res.render("urls_login", { username: req.cookies.user_id })
  } else {
    const shortURL = generateRandomString();
    const userURLs = urlsForUser(cookiesID, urlDatabase);
    const longURL = req.body.longURL
    urlDatabase[shortURL] = { longURL, userID: req.cookies.user_id };
    userURLs[shortURL] = urlDatabase[shortURL]
    res.redirect(`/u/`)
  }
})

//creatin new short url
app.get("/u/new", (req, res) => {
  let cookiesID = req.cookies.user_id;
  if (cookiesID !== undefined) {
    let templateVars = { username: users[req.cookies.user_id] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});

//redirection to initial site longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  if (!longURL) {
    res.statusCode = 404;
    res.send(" Sorry, code 404, Page Not Found");
  } else {
    res.redirect(longURL)
  }
});

//redirection to edit page
app.get("/u/:shortURL/update/", (req, res) => {
  let cookiesID = req.cookies.user_id;
  if (cookiesID !== undefined) {
    const shortURL = req.params.shortURL
    const longURL = urlDatabase[shortURL].longURL
    const templateVars = { longURL, shortURL, username: users[req.cookies.user_id] }
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login")
  }
});

//adding edit option on urls_show.ejs
app.post("/u/:shortURL/update", (req, res) => {
  let cookiesID = req.cookies.user_id
  const shortURL = req.params.shortURL
  const longURL = req.body.longURL
  const userURLs = urlsForUser(cookiesID, urlDatabase);
  userURLs[shortURL].longURL = longURL;
  res.redirect(`/u/`)
})
// adding delete  to the urls_index
app.post("/u/:shortURL/delete", (req, res) => {
  let cookiesID = req.cookies.user_id;
  if (cookiesID !== undefined) {
    const del = req.params.shortURL;
    const userURLs = urlsForUser(cookiesID, urlDatabase);
    delete urlDatabase[del];
    res.redirect("/u");
  } else {
    res.redirect("/login")
  }
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
    res.send("Proceed to login, please. Code 400")
  }
});

//adding login functionality
app.get("/login", (req, res) => {
  res.render("urls_login", { username: req.cookies.user_id })
});

//adding login feature in header
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (getID(email, password, users) !== false) {
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