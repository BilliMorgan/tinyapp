const bcrypt = require('bcrypt')
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
}


const checkEmail = (emailToCheck, databaseObj) => {
let bool = false;
for (elem in databaseObj){
  if (databaseObj[elem].email === emailToCheck){
    bool = true
  }
}
  return bool;
}
//console.log(checkEmail("user@example.com", users))



const checkPassword = (passwordToCheck, databaseObj) => {
  let bool = false;
  for (elem in databaseObj){
    if(databaseObj[elem].password === passwordToCheck){
      bool = true
    }
  }
  return bool;
}
//console.log(checkPassword("purple-monkey-dinosaur", users))



const getID = (email, databaseObj) => {
for(let id in databaseObj){
  //console.log(id)
  if(databaseObj[id].email === email) {
    
    return id;
  }
}
return false;
};
//console.log(getID("user@example.com","purple-monkey-dinosaur", users))

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

module.exports = { checkEmail, checkPassword, getID, generateRandomString };
