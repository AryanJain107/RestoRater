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
    methods: ["GET", "POST"],
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

//  app.post('/register', (req, res)=> {
//     const username = req.body.username;
//     const password = req.body.password;
//     db.execute(
//       "INSERT INTO users (username, password) VALUES (?,?)",
//       [username, password],
//       (err, result)=> {
//       console.log(err);
//       }
//     );
//  });

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

// app.post('/login', (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;

//     db.execute(
//         "SELECT * FROM users WHERE email = ?",
//         [email],
//         (err, result) => {
//             if (err) {
//                 res.send({ err: err });
//             } else {
//                 if (result.length > 0) {
//                     if (result[0].password === password) {
//                         res.send(result);
//                     } else {
//                         res.send({ message: "Wrong password!" });
//                     }
//                 } else {
//                     res.send({ message: "Email does not exist!" });
//                 }
//             }
//         }
//     );
// });
