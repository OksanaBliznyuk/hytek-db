var express = require("express");
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var db = require("./db.js")

const HTTP_PORT = 8099
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

// GET enkeltutstyr
app.get("/equipment/:id", (req, res, next) => {
  const id = req.params.id;
  if (isNaN(id)) {
      res.status(400).json({"error": "Ugyldig ID"});
      return;
  }

  const sql = "SELECT * FROM equipment WHERE equipment_id = ?";
  const params = [id];

  db.all(sql, params, (err, rows) => {
      if (err) {
          res.status(400).json({"error": err.message});
          return;
      }
      res.json({
          "message": "success",
          "equipment": rows
      });
  });
});

// GET all utstyr
app.get("/equipment", (req, res, next) => {
  const sql = "SELECT * FROM equipment ORDER BY equipment_id";

  db.all(sql, (err, rows) => {
      if (err) {
          res.status(400).json({"error": err.message});
          return;
      }
      res.json({
          "message": "success",
          "equipment": rows
      });
  });
});

// POST nytt utstyr
app.post("/equipment", (req, res, next) => {
  const { equipment_name, equipment_quantity, equipment_available, equipment_descr, equipment_img, date_created, date_lastUpdated } = req.body;
  let sql = `INSERT INTO equipment (equipment_name, equipment_quantity, equipment_available, equipment_descr, equipment_img, date_created, date_lastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  let params = [equipment_name, equipment_quantity, equipment_available, equipment_descr, equipment_img, date_created, date_lastUpdated];

  db.run(sql, params, function(err) {
      if (err) {
          res.status(400).json({"error": err.message});
          return;
      }
      res.status(201).json({
          "success": "Ny rad opprettet",
          "id": this.lastID
      });
  });
});

// PATCH oppdater utstyr
app.patch("/equipment/:id", (req, res, next) => {
  const equipment_id = req.params.id;
  const { equipment_name, equipment_quantity, equipment_available, equipment_descr, equipment_img, date_lastUpdated } = req.body;

  let params = [];
  let updateElements = [];

  if (equipment_name != null) {
      updateElements.push("equipment_name = ?");
      params.push(equipment_name);
  }
  if (equipment_quantity != null) {
      updateElements.push("equipment_quantity = ?");
      params.push(equipment_quantity);
  }
  if (equipment_available != null) {
      updateElements.push("equipment_available = ?");
      params.push(equipment_available);
  }
  if (equipment_descr != null) {
      updateElements.push("equipment_descr = ?");
      params.push(equipment_descr);
  }
  if (equipment_img != null) {
      updateElements.push("equipment_img = ?");
      params.push(equipment_img);
  }
  if (date_lastUpdated != null) {
      updateElements.push("date_lastUpdated = ?");
      params.push(date_lastUpdated);
  }

  if (updateElements.length === 0) {
      res.status(400).json({"error": "Ingen oppdateringsdata oppgitt"});
      return;
  }

  let sql = `UPDATE equipment SET ${updateElements.join(", ")} WHERE equipment_id = ?`;
  params.push(equipment_id);

  db.run(sql, params, (err) => {
      if (err) {
          res.status(400).json({"error": err.message});
          return;
      }
      res.status(200).json({"success": "Utstyret oppdatert"});
  });
});

// DELETE utstyr
app.delete("/equipment/:id", (req, res, next) => {
  const equipment_id = req.params.id;
  let sql = 'DELETE FROM equipment WHERE equipment_id = ?';
  let params = [equipment_id];

  db.run(sql, params, function(err) {
      if (err) {
          res.status(400).json({"error": err.message});
          return;
      }
      if (this.changes > 0) {
          res.status(200).json({"success": "Rad slettet", "rowsAffected": this.changes});
      } else {
          res.status(404).json({"error": "Ingen rad funnet med gitt ID"});
      }
  });
});

app.get("/events", (req, res, next) => {
  let sql = "SELECT * FROM events";
  let params = [];
  let conditions = [];

  if (req.query.equipment_id) {
    conditions.push("eq_id = ?");
    params.push(req.query.equipment_id);
  }

  if (req.query.event_startdate) {
    conditions.push("event_startdate = ?");
    params.push(req.query.event_startdate);
  }

  if (req.query.event_enddate) {
    conditions.push("event_enddate = ?");
    params.push(req.query.event_enddate);
  }

  if (req.query.event_user_id) {
    conditions.push("eventuser_id = ?");
    params.push(req.query.event_user_id);
  }

  if (req.query.event_user_name) {
    conditions.push("eventuser_name = ?");
    params.push(req.query.event_user_name);
  }

  if (req.query.event_type) {
    conditions.push("event_type = ?");
    params.push(req.query.event_type);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  db.all(sql, params, (err, rows) => {
      if (err) {
          res.status(400).json({"error": err.message});
          return;
      }
      res.json({
          "message": "success",
          "events": rows
      });
  });
});


// POST et nytt event
app.post("/events", (req, res, next) => {
  const { eq_id, eventuser_id, eventuser_name, event_quantity, event_comment, event_startdate, event_enddate, event_type } = req.body;
  // const event_startdate = new Date().toISOString(); // Automatisk datostempel

  let sql = `INSERT INTO events (eq_id, eventuser_id, eventuser_name, event_quantity, event_comment, event_startdate, event_enddate, event_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  let params = [eq_id, eventuser_id, eventuser_name, event_quantity, event_comment, event_startdate, event_enddate, event_type];
console.log(params);
  db.run(sql, params, function(err) {
      if (err) {
          res.status(400).json({"error": err.message});
          return;
      }
      res.status(201).json({
          "success": "Nytt event opprettet",
          "id": this.lastID
      });
  });
});


// DELETE event
app.delete("/events/:id", (req, res, next) => {
    const event_id = req.params.id;
    let sql = 'DELETE FROM events WHERE event_id = ?';
    let params = [event_id];
  console.log("Klar til å slette event id " + event_id);
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        if (this.changes > 0) {
            res.status(200).json({"success": "Rad slettet", "rowsAffected": this.changes});
        } else {
            res.status(404).json({"error": "Ingen rad funnet med gitt ID"});
        }
    });
  });

  
  

module.exports = app;
