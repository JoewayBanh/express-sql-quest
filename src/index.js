require("dotenv").config();
const express = require("express");
const connection = require("./config");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser')

app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});



app.get("/", (req, res) => {
  res.send("This is the express+SQL quest");
});


app.get("/all", (req, res) => {
  connection.query(
    "select * from express_SQL", (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving all the data");
      } else {
        res.status(200).json(results);
      }
    })
});


app.get("/all/:id", (req, res) => {
  const id = req.params.id
  connection.query(
    "select * from express_sql where id=?",
    [id], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving data from this is id.");
      } else {
        console.log(results)
        res.status(200).json(results);
      }
    }
  );
});


app.get("/filter/contains", (req, res) => {
  connection.query(
    'select * from express_sql where name like "%s%"',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving filtered data ");
      } else {
        console.log(results)
        res.status(200).json(results);
      }
    }
  );
});
app.get("/filter/startswith", (req, res) => {
  connection.query(
    'select * from express_sql where name like "j%"',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving filtered data for names");
      } else {
        console.log(results)
        res.status(200).json(results);
      }
    }
  );
});
app.get("/filter/greater", (req, res) => {
  connection.query(
    'select * from express_sql where birthday > "1991-02-17"',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving filtered data for bdays greater than et-eller-andet");
      } else {
        console.log(results)
        res.status(200).json(results);
      }
    }
  );
});


app.get("/all/ascending", (req, res) => {
  connection.query(
    "select * from express_sql order by name asc",
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving filtered data for ascending names");
      } else {
        console.log(results)
        res.status(200).json(results);
      }
    }
  );
});


app.post("/", (req, res) => {
  const { name, age, birthday, male } = req.body;

  connection.query(
    "insert into express_sql (name, age, birthday, male) values(?,?,?,?)",
    [name, age, birthday, male], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error saving new person data");
      } else {
        res.status(200).send("New person data has been saved");
      }
    }
  );
});


app.put("/update/:id", (req, res) => {
  const id = req.params.id
  const toBeUpdated = req.body

  connection.query(
    "update express_sql set ? where id=?",
    [toBeUpdated, id], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Couldn't update person data");
      } else {
        res.status(200).send("Person data has been updated! 🎉");
      }
    }
  );
});


app.put("/update/toggle/:id", (req, res) => {
  const id = req.params.id

  connection.query(
    "update express_sql set male=(case when male=1 then 0 else 1 end) where id=?",
    [id], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Couldn't update gender");
      } else {
        res.status(200).send("Gender has been updated! We woke! 🎉");
      }
    }
  );
});


app.delete("/delete/:id", (req, res) => {
  const id = req.params.id

  connection.query(
    "delete from express_sql where id=?",
    [id], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Couldn't delete data");
      } else {
        res.status(200).send("Data has been deleted! 🎉");
      }
    }
  );
});


app.delete("/delete-false", (req, res) => {
  connection.query(
    "delete from express_sql where male=0", 
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Couldn't delete all data with boolean false");
      } else {
        res.status(200).send("All data with boolean set to false has been deleted! 🎉");
      }
    }
  );
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
