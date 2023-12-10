const express = require("express");
const app = express();
app.use(express.json());
app.listen(3001, () => {
  console.log("running server");
});
const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
const mysql = require("mysql2");
const db = mysql.createConnection({
  user: "root",
  host: "34.172.5.190",
  password: "Test1234",
  database: "db1",
});

app.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  // Check if the username already exists
  db.execute(
    "SELECT email FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        // console.log(err);
        res.status(500).json({ message: "Database error. Please try again." });
      } else {
        if (results.length > 0) {
          res
            .status(400)
            .json({
              message: "Email already exists. Please choose a different email.",
            });
        } else {
          db.execute(
            "INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)",
            [email, name, password, role],
            (insertErr, insertResult) => {
              if (insertErr) {
                console.log(insertErr);
                res
                  .status(500)
                  .json({ message: "Registration failed. Please try again." });
              } else {
                res.status(200).json({ message: "Registration successful." });
              }
            }
          );
        }
      }
    }
  );
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.execute(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send({ message: "Wrong username/password combination!" });
        }
      }
    }
  );
});


app.get("/restaurants", (req, res) => {
  // Fetch restaurant data from the database with owner names
  const query = `
    SELECT restaurants.*, users.name AS ownerName
    FROM restaurants
    JOIN users ON restaurants.ownerId = users.userId;
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching restaurant data:", err);
      res.status(500).json({ message: "Error fetching restaurant data" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/ownerrestaurants', (req, res) => {
  const ownerId = req.query.ownerId;
 
  const query = 'SELECT * FROM restaurants WHERE ownerId = ?';
 
  db.query(query, [ownerId], (error, results) => {
    if (error) {
      console.error('Error fetching restaurants:', error);
      res.status(500).send('Error fetching restaurants');
    } else {
      res.send(results);
    }
  });
 });
 

app.post("/addRestaurant", (req, res) => {
  const { name, ownerId, city, state, cuisineType, numDishes } = req.body;

  // Check if any required field is undefined
  if (name === undefined || ownerId === undefined || city === undefined || state === undefined || cuisineType === undefined || numDishes === undefined) {
    console.log(name)
    console.log(ownerId)
    console.log(city)
    console.log(state)
    console.log(numDishes)
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Your SQL query to insert data into the restaurants table
  const sql = "INSERT INTO restaurants (name, ownerId, city, state, cuisineType, dishCount) VALUES (?, ?, ?, ?, ?, ?)";

  // Execute the SQL query with the provided values
  db.execute(sql, [name, ownerId, city, state, cuisineType, numDishes], (err, result) => {
    if (err) {
      console.error("Error inserting into restaurants table:", err);
      return res.status(500).json({ message: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Restaurant added successfully." });
  });
});


app.put("/updateRestaurant/:restId", (req, res) => {
  const restId = req.params.restId;
  const updatedDetails = req.body;
  // console.log(req.body);
  // Your SQL query to update data in the restaurants table
  const sql = `
    UPDATE restaurants
    SET name = ?, cuisineType = ?, city = ?, state = ?, dishCount = ?
    WHERE restId = ?;
  `;

  // Execute the SQL query with the provided values
  db.execute(
    sql,
    [updatedDetails.name, updatedDetails.cuisineType, updatedDetails.city, updatedDetails.state, updatedDetails.dishCount, restId],
    (err, result) => {
      if (err) {
        console.error("Error updating restaurant:", err);
        return res.status(500).json({ message: "Internal Server Error." });
      }
      return res.status(200).json({ message: "Restaurant updated successfully." });
    }
  );
});

app.delete("/removeRestaurant/:restId", (req, res) => {
  const restId = req.params.restId;
 
  // Your SQL query to delete data from the restaurants table
  const sql = "DELETE FROM restaurants WHERE restId = ?";
 
  // Execute the SQL query with the provided value
  db.execute(sql, [restId], (err, result) => {
    if (err) {
      console.error("Error deleting restaurant:", err);
      return res.status(500).json({ message: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Restaurant deleted successfully." });
  });
 });
 

 // In your server.js or routes file
app.get("/cuisineTypes", (req, res) => {
  // Fetch distinct cuisine types from your database
  db.query("SELECT DISTINCT cuisineType FROM restaurants", (err, result) => {
    if (err) {
      console.error("Error fetching cuisine types:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const cuisineTypes = result.map((row) => row.cuisineType);
      res.status(200).json(cuisineTypes);
    }
  });
});


 // In your server.js or routes file
 app.get("/ratingTypes", (req, res) => {
  // Fetch distinct cuisine types from your database
  db.query("SELECT DISTINCT rating FROM restaurants", (err, result) => {
    if (err) {
      console.error("Error fetching rating types:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const ratingTypes = result.map((row) => row.rating);
      res.status(200).json(ratingTypes);
    }
  });
});


app.get("/filterrestaurants", (req, res) => {
  const { cuisine, rating, name, ownerName } = req.query;
  // SQL query to fetch filtered restaurant data
  let query = `
    SELECT restaurants.*, users.name AS ownerName
    FROM restaurants
    JOIN users ON restaurants.ownerId = users.userId
  `;
  const conditions = [];

  const parameters = [];

  if (cuisine) {
   conditions.push(`cuisineType = ?`);
   parameters.push(cuisine);
  }
  
  if (rating) {
   conditions.push(`rating = ?`);
   parameters.push(rating);
  }
  
  if (name) {
   conditions.push(`restaurants.name LIKE ?`);
   parameters.push(`%${name}%`);
  }

  if (ownerName) {
    conditions.push(`users.name LIKE ?`);
    parameters.push(`%${ownerName}%`);
   }
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  // Execute the SQL query with parameters
  db.query(query, parameters, (err, results) => {
    if (err) {
      console.error("Error fetching restaurant data:", err);
      res.status(500).json({ message: "Error fetching restaurant data" });
    } else {
      res.status(200).json(results);
    }
  });
});

