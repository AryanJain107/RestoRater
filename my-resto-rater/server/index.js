const express = require("express");
const app = express();
app.use(express.json());
const { Sequelize, DataTypes } = require("sequelize");

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

  if (name === undefined || ownerId === undefined || city === undefined || state === undefined || cuisineType === undefined || numDishes === undefined) {
    console.log(name)
    console.log(ownerId)
    console.log(city)
    console.log(state)
    console.log(numDishes)
    return res.status(400).json({ message: "Missing required fields." });
  }

  const sql = "INSERT INTO restaurants (name, ownerId, city, state, cuisineType, dishCount) VALUES (?, ?, ?, ?, ?, ?)";

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
  
  const sql = `
    UPDATE restaurants
    SET name = ?, cuisineType = ?, city = ?, state = ?, dishCount = ?
    WHERE restId = ?;
  `;

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

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error beginning transaction:", err);
      return res.status(500).json({ message: "Error beginning transaction" });
    }

    const sql = "DELETE FROM restaurants WHERE restId = ?";

    db.execute(sql, [restId], (err, result) => {
      if (err) {
        console.error("Error deleting restaurant:", err);
        return db.rollback(() => {
          res.status(500).json({ message: "Internal Server Error." });
        });
      }

      const sql2 = "DELETE FROM user_rating WHERE restId = ?";

      db.execute(sql2, [restId], (err, result) => {
        if (err) {
          console.error("Error deleting restaurant:", err);
          return db.rollback(() => {
            res.status(500).json({ message: "Internal Server Error." });
          });
        }

        db.commit((commitErr) => {
          if (commitErr) {
            console.error("Error committing transaction:", commitErr);
            return res.status(500).json({ message: "Error committing transaction" });
          }
          res.status(200).json({ message: "Restaurant deleted successfully." });
        });
      });
    });
  });
});

const sequelize = new Sequelize("db1", "root", "Test1234", {
  host: "34.172.5.190",
  dialect: "mysql",
});

const Rating = sequelize.define("restaurants", {
  rating: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cuisineType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// app.get("/cuisineTypes", (req, res) => {
//   // Fetch distinct cuisine types from your database
//   db.query("SELECT DISTINCT cuisineType FROM restaurants", (err, result) => {
//     if (err) {
//       console.error("Error fetching cuisine types:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       const cuisineTypes = result.map((row) => row.cuisineType);
//       res.status(200).json(cuisineTypes);
//     }
//   });
// });

app.get("/cuisineTypes", async (req, res) => {
  try {
    const cuisineTypes = await Rating.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('cuisineType')), 'cuisineType']],
    });

    const cuisineTypesArray = cuisineTypes.map((restaurant) => restaurant.cuisineType);

    res.status(200).json(cuisineTypesArray);
  } catch (error) {
    console.error("Error fetching cuisine types:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/ratingTypes", async (req, res) => {
  try {
    const distinctRatings = await Rating.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("rating")), "rating"]],
    });

    const ratingTypes = distinctRatings.map((row) => row.rating);
    res.status(200).json(ratingTypes);
  } catch (error) {
    console.error("Error fetching rating types:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  // In your server.js or routes file
//  app.get("/ratingTypes", (req, res) => {
//   // Fetch distinct cuisine types from your database
//   db.query("SELECT DISTINCT rating FROM restaurants", (err, result) => {
//     if (err) {
//       console.error("Error fetching rating types:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       const ratingTypes = result.map((row) => row.rating);
//       res.status(200).json(ratingTypes);
//     }
//   });
// });


app.get("/filterrestaurants", (req, res) => {
  const { cuisine, rating, name, ownerName } = req.query;
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

  db.query(query, parameters, (err, results) => {
    if (err) {
      console.error("Error fetching restaurant data:", err);
      res.status(500).json({ message: "Error fetching restaurant data" });
    } else {
      res.status(200).json(results);
    }
  });
});



app.post("/addReview/:restaurantId", (req, res) => {
  const restaurantId = req.params.restaurantId;
  const { rating, comment, userId } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: "Rating and comment are required" });
  }

  const query = "INSERT INTO user_rating (restId, userRating, userComment, userId) VALUES (?, ?, ?, ?)";
  
  db.query(query, [restaurantId, rating, comment, userId], (err, results) => {
    if (err) {
      console.error("Error adding review:", err);
      return res.status(500).json({ message: "Error adding review" });
    }

    res.status(200).json({ message: "Review added successfully" });
  });
});

app.get("/getComments/:restaurantId", (req, res) => {
  const restaurantId = req.params.restaurantId;
  const query = `
    SELECT user_rating.*, users.name AS userName
    FROM user_rating
    JOIN users ON user_rating.userId = users.userId
    WHERE user_rating.restId = ?;
  `;

  db.query(query, [restaurantId], (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err);
      res.status(500).json({ message: "Error fetching comments" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/addRating/:restaurantId", (req, res) => {
  const restaurantId = req.params.restaurantId;
  const { rating } = req.body;

  const query = "SELECT AVG(userRating) as average FROM user_rating WHERE user_rating.restId = ?;";
  
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error beginning transaction:", err);
      return res.status(500).json({ message: "Error beginning transaction" });
    }

    db.query(query, [restaurantId], (err, results) => {
      if (err) {
        console.error("Error fetching comments:", err);
        return db.rollback(() => {
          res.status(500).json({ message: "Error fetching comments" });
        });
      } else {
        const averageRating1 = results[0].average;

        const sql = `
          UPDATE restaurants
          SET rating = ?
          WHERE restId = ?;
        `;

        db.query(sql, [averageRating1, restaurantId], (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error updating restaurant rating:", updateErr);
            return db.rollback(() => {
              res.status(500).json({ message: "Error updating restaurant rating" });
            });
          } else {
            db.commit((commitErr) => {
              if (commitErr) {
                console.error("Error committing transaction:", commitErr);
                return res.status(500).json({ message: "Error committing transaction" });
              }
              res.status(200).json({ message: "Rating and average rating updated successfully" });
            });
          }
        });
      }
    });
  });
});
