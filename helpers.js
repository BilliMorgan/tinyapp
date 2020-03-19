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
console.log(checkEmail("user@example.com", users))



const checkPassword = (passwordToCheck, databaseObj) => {
  let bool = false;
  for (elem in databaseObj){
    if(databaseObj[elem].password === passwordToCheck){
      bool = true
    }
  }
  return bool;
}
console.log(checkPassword("purple-monkey-dinosaur", users))



const getID = (email, password, databaseObj) => {
for(let id in databaseObj){
  console.log(id)
  if(databaseObj[id].email === email && databaseObj[id].password === password){
    return id;
  }
}
return false;
};
console.log(getID("user@example.com","purple-monkey-dinosaur", users))



module.exports = { checkEmail, checkPassword, getID };
