const { assert } = require('chai');

const { getID } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getID', function() {
  it('should return a user with valid email', function() {
    const user = getID ("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });
  it('should return false with invalid email', function() {
    const user = getID ("notuser@example.com", testUsers)
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });
});