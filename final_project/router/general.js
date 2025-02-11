const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  let user = users.find(u => u.username === username)

  if (user) {
    res.status(400).json({ error: "Username already exists" });
  } else {
    const valid = isValid(req.body);
    if (!valid) {
      res.status(400).json({ error: "Invalid username or password" });
    } else {
      users.push({ username, password })
      res.status(201).json({ message: "User created successfully" });
    }
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(200).json(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let result = []
  for(let book of Object.values(books)){
    if(book.author === req.params.author)
      result.push(book);
  }
  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let result = []
  for(let book of Object.values(books)){
    if(book.title === req.params.title)
      result.push(book);
  }
  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
