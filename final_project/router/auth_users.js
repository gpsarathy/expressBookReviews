const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (body)=>{ //returns boolean
//write code to check is the username is valid
return body.username.split(" ").length < 2 && body.username.length > 2 && body.password.split(" ").length < 2 && body.password.length;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.send("Logged in successfully!")
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(req.session.authorization){
    const isbn = req.params.isbn;
    const review = {
      review: req.query.review,
      reader: req.session.authorization.username
    };
    const book = books[isbn]
    if(book){
      book.reviews[req.session.authorization.username] = review;
      return res.send(book)
    }else{
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized access" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ errorMessage: "Book not found" });
  } else {
    const username = req.session.authorization.username;
    const userHasReview = book.reviews[username];

    if (userHasReview) {
      delete book.reviews[username];
      return res.send(book);
    } else {
      return res.status(404).json({ errorMessage: "you did not add a review for this book" });
    }
  }

});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
