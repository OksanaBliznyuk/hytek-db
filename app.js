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
    console.log(sql);
    console.log(params);
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

// PATCH for å oppdatere en eksisterende hendelse
app.patch("/events/:id", (req, res, next) => {
    const eventId = req.params.id;
    const { event_type, ...updatedFields } = req.body; // Fjerner event_type fra oppdaterte felt
  
    let sql = `UPDATE events 
               SET ${Object.keys(updatedFields).map(key => `${key} = ?`).join(', ')} 
               WHERE event_id = ?`; // Legger til betingelsen for event_type
    let params = [...Object.values(updatedFields), eventId]; // Legger til event_type til parameterne
    db.run(sql, params, function(err) {
        console.log(sql);
        console.log(params);
  
        if (err) {
        res.status(400).json({"error": err.message});
        return;
      }
      if (this.changes > 0) {
        res.status(200).json({"success": "Hendelse oppdatert", "rowsAffected": this.changes});
      } else {
        res.status(404).json({"error": "Ingen hendelse funnet med gitt ID eller event_type"});
      }
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


  //---------LoanOut---Må lages API----------------------
  
  app.get("/loans", (req, res, next) => {
    let sql = "SELECT * FROM loans";
    let params = [];
    let conditions = [];
  
    if (req.query.equipment_id) {
      conditions.push("eq_id = ?");
      params.push(req.query.equipment_id);
    }
  
    if (req.query.loan_startdate) {
      conditions.push("loan_startdate = ?");
      params.push(req.query.loan_startdate);
    }
  
    if (req.query.loan_enddate) {
      conditions.push("loan_enddate = ?");
      params.push(req.query.loan_enddate);
    }
  
    if (req.query.loan_user_id) {
      conditions.push("loanuser_id = ?");
      params.push(req.query.event_user_id);
    }
  
    if (req.query.loan_user_name) {
      conditions.push("loanuser_name = ?");
      params.push(req.query.loan_user_name);
    }
  
    if (req.query.loan_type) {
      conditions.push("loan_type = ?");
      params.push(req.query.loan_type);
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
            "loans": rows
        });
    });
  });
  
  
  // POST et nytt loan
  app.post("/loans", (req, res, next) => {
    const { eq_id, loanuser_id, loanuser_name, loan_quantity, loan_comment, loan_startdate, loan_enddate, loan_type } = req.body;
  
    let sql = `INSERT INTO loans (eq_id, loanuser_id, loanuser_name, loan_quantity, loan_comment, loan_startdate, loan_enddate, loan_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    let params = [eq_id, loanuser_id, loanuser_name, loan_quantity, loan_comment, loan_startdate, loan_enddate, loan_type];
  console.log(params);
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.status(201).json({
            "success": "Nytt loan opprettet",
            "id": this.lastID
        });
    });
  });
  
  
  // DELETE loan
  app.delete("/loans/:id", (req, res, next) => {
      const loan_id = req.params.id;
      let sql = 'DELETE FROM loans WHERE loan_id = ?';
      let params = [loan_id];
    console.log("Klar til å slette event id " + loan_id);
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


    //---------ReturnLoan----Må lages API-------------

    app.get("/returnloans", (req, res, next) => {
        let sql = "SELECT * FROM returnloans";
        let params = [];
        let conditions = [];
      
        if (req.query.equipment_id) {
          conditions.push("eq_id = ?");
          params.push(req.query.equipment_id);
        }
      
        if (req.query.returnloan_startdate) {
          conditions.push("returnloan_startdate = ?");
          params.push(req.query.event_startdate);
        }
      
        if (req.query.returnloan_enddate) {
          conditions.push("returnloan_enddate = ?");
          params.push(req.query.returnloan_enddate);
        }
      
        if (req.query.returnloan_user_id) {
          conditions.push("returnloanuser_id = ?");
          params.push(req.query.returnloan_user_id);
        }
      
        if (req.query.returnloan_user_name) {
          conditions.push("returnloan_name = ?");
          params.push(req.query.returnloan_user_name);
        }
      
        if (req.query.returnloan_type) {
          conditions.push("returnloan_type = ?");
          params.push(req.query.returnloan_type);
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
                "returnloans": rows
            });
        });
      });
      
      
      // POST et nytt return
      app.post("/returnloans", (req, res, next) => {
        const { eq_id, returnloanuser_id, returnloanuser_name, returnloan_quantity, returnloan_comment, returnloan_startdate, returnloan_enddate, returnloan_type } = req.body;
      
        let sql = `INSERT INTO returnloans (eq_id, returnloanuser_id, returnloanuser_name, returnloan_quantity, returnloan_comment, returnloan_startdate, returnloan_enddate, returnloan_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        let params = [eq_id, returnloanuser_id, returnloanuser_name, returnloan_quantity, returnloan_comment, returnloan_startdate, returnloan_enddate, returnloan_type];
      console.log(params);
        db.run(sql, params, function(err) {
            if (err) {
                res.status(400).json({"error": err.message});
                return;
            }
            res.status(201).json({
                "success": "Nytt returnloan opprettet",
                "id": this.lastID
            });
        });
      });
      
      
      // DELETE return
      app.delete("/returnloans/:id", (req, res, next) => {
          const returnloan_id = req.params.id;
          let sql = 'DELETE FROM returnloans WHERE returnloan_id = ?';
          let params = [returnloan_id];
        console.log("Klar til å slette returnloan id " + returnloan_id);
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
