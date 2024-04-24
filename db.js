
var sqlite3 = require("sqlite3").verbose();
const DATASOURCE = "hytek.db";

// Opprett databaseforbindelse
let db = new sqlite3.Database(DATASOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the hytek database.");
    createEquipmentTable();
  }
});

function createEquipmentTable() {
  const createEquipmentSql = `
    CREATE TABLE IF NOT EXISTS equipment (
      equipment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipment_name TEXT,
      equipment_quantity INTEGER,
      equipment_available INTEGER,
      equipment_descr TEXT,
      equipment_img TEXT,
      date_created DATE,
      date_lastUpdated DATE
    )`;

  db.run(createEquipmentSql, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Equipment table created or already exists.");
      insertInitialEquipmentData();
    }
  });
}

function insertInitialEquipmentData() {
  const insertSql = `
    INSERT INTO equipment (equipment_name, equipment_quantity, equipment_available, equipment_descr, equipment_img, date_created, date_lastUpdated)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  // Eksempeldata - dette skal repeteres for hver utstyrsenhet du vil legge til
  const equipmentData = [
    ["Arduino starter kits", 2, 2, "", "", "2024-01-01", "2024-01-01"],
    ["Cricut vinylkutter", 2, 2, "", "", "2024-01-01", "2024-01-01"],
      ["Edison robot expansion set", 10, 10, "", "", "2024-01-01", "2024-01-01"],
      ["Edison roboter", 28, 28, "", "", "2024-01-01", "2024-01-01"],
      ["Husquarna Viking overlock", 1, 1, "", "", "2024-01-01", "2024-01-01"],
      ["HusquarnaViking symaskin", 2, 2, "", "", "2024-01-01", "2024-01-01"],
      ["Little Bits", 3, 3, "", "", "2024-01-01", "2024-01-01"],
      ["Micro:bit", 50, 50, "", "", "2024-01-01", "2024-01-01"],
      ["Mikro:bit bot", 6, 6, "", "", "2024-01-01", "2024-01-01"],
      ["Mikro:bit minode kit", 8, 8, "", "", "2024-01-01", "2024-01-01"],
      ["Mikro:bit Smart home kit", 28, 28, "", "", "2024-01-01", "2024-01-01"],
      ["Mikro:bit starter kit elecfreaks", 18, 18, "", "", "2024-01-01", "2024-01-01"],
      ["Pfaff symaskin", 4, 4, "", "", "2024-01-01", "2024-01-01"],
      ["Raspberry pi4 ", 17, 17, "", "", "2024-01-01", "2024-01-01"],
      ["Spherobolt", 15, 15, "", "", "2024-01-01", "2024-01-01"],
  ];

  equipmentData.forEach((equipment) => {
    const checkSql = "SELECT COUNT(*) AS count FROM equipment WHERE equipment_name = ?";
    db.get(checkSql, [equipment[0]], (checkErr, row) => {
      if (checkErr) {
        console.error(checkErr.message);
        return;
      }

      if (row.count === 0) {
        const insertSql = "INSERT INTO equipment (equipment_name, equipment_quantity, equipment_available, equipment_descr, equipment_img, date_created, date_lastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.run(insertSql, equipment, (insertErr) => {
          if (insertErr) {
            console.error(insertErr.message);
          } else {
            console.log("Equipment data inserted");
          }
        });
      } else {
        console.log("Equipment already exists:", equipment[0]);
      }
    });
  });
  updateEquipmentData();
}

function updateEquipmentData() {
  const updateSql = `
    UPDATE equipment
    SET equipment_descr = ?, equipment_img = ?
    WHERE equipment_id = ?`;

  // Eksempel på oppdateringer
  const updates = [
    ["Arduino Official Starter Kit er en startpakke fra Arduino som inneholder alt du trenger for å komme i gang med Arduino. Pakken inneholder introduksjonsbok på 170 sider (på Engelsk) med 15 prosjekter (se nedenfor) som lærer deg det grunnleggende innen elektronikk og programmering med Arduino.", "http://", 1],
    ["Cricut vinylkutter er en maskin som lar deg kutte ulike typer vinyl og annet materiale til bruk til f.eks. klistremerker, styrkemerker etc. Vi har to maskiner og en del vinyl av ulik slag, samt tilbehør tilgjengelig, som står på HeyTek, men som kan lånes ut av rommet etter avtale.", "http://", 2],
    ["Edison robot expansion set Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her", "http://",3],
    ["Edison kompakt robot som egner seg ypperlig for innlæring av logisk tenkning, strukturering av problemer og programmering. Den kommer med utvidelsessett slik at den kan bygges om til ulike maskiner. Vi har 28 sett tilgjengelig.", "http://",4],
    ["Vi har tre ulike typer symaskiner, hvor av en er en overlock. Disse befinner seg på rom N313, men kan lånes ut av rommet etter avtale.", "http://",5],
    ["Vi har tre ulike typer symaskiner, hvor av en er en overlock. Disse befinner seg på rom N313, men kan lånes ut av rommet etter avtale.", "http://",6],
    ["Little bits Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her", "http://",7],
    [" Micro:bit er en datamaskin i lommeformat som du kan programmere, tilpasse og kontrollere for å sette dine digitale ideer, spill og programmer ut i livet. Vi har flere ulike tilleggsprodukter/ utvidelsessett tilgjengelig. Vi har mer enn 50 tilgjengelig. Programmeres med programmet makecode Trykk her til å finne mer","http://",8],
    ["Micro:bit Bit:bot XL er et robot-kjøretøy man kan kontrollere med programmering sammen med Micro:bit. Vi har10 sett tilgjengelig.", "http://",9],
    ["Micro:bit mi:node er et sett med ulike sensorer som kan bobles til micro:biten for å utforske og programmere hvordan sensorer fungerer. Vi har 8 sett tilgjengelig.", "http://",10],
    ["Micro:bit Elecfreaks smarthome kit er en utvidelse som lar deg designe, eksperimentere og programmere ditt eget smart-hus. Vi har 29 sett tilgjengelig.", "http://",11],
    ["Micro:bit Elecfreaks starterkit er en utvidelse som lar deg lære og eksperimentere med strømkretser og komponenter gjennom programmering. Vi har 18 sett tilgjengelig.", "http://",12],
    ["Vi har tre ulike typer symaskiner, hvor av en er en overlock. Disse befinner seg på rom N313, men kan lånes ut av rommet etter avtale.", "http://",13],
    ["Raspberry Pi er en programmerbar datamaskin (64-bits firekjerners prosessor på 1,5 GHz, støtte for to skjermer med oppløsninger på opptil 4K på 60 fps, opptil 4 GB RAM, dual-band 2.4/5.0 GHz trådløst LAN, Bluetooth 5.0 / BLE True Gigabit Ethernet, USB 3.0 ). Vi har 14 sett tilgjengelig.", "http://",14],
    ["SpheroBolt er en appstyrt, programmerbar robot formet som en ball. Boten kan kodes til å rulle i ulike retninger. Den har også en programmerbar LED-matrise, samt infrarød sensor som gjør at den kan interagere med andre boter. Vi har ett sett a 15 SpheroBolt tilgjengelig.", "http://",15]
];

  updates.forEach((update) => {
    db.run(updateSql, update, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Equipment data updated");
      }
    });
  });

  createEventsTable();
}

function createEventsTable() {
  const createEventsSql = `
    CREATE TABLE IF NOT EXISTS events (
      event_id INTEGER PRIMARY KEY AUTOINCREMENT,
      eq_id INTEGER,
      eventuser_id INTEGER,
      eventuser_name TEXT,
      event_quantity INTEGER,
      event_comment TEXT,
      event_date DATE,
      event_startdate DATE,
      event_enddate DATE,
      event_type TEXT
    )`;

  db.run(createEventsSql, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Events table created or already exists.");
      insertInitialEventData();
    }
  });
}

function insertInitialEventData() {
  const insertSql = `
    INSERT INTO events (eq_id, eventuser_id, eventuser_name, event_quantity, event_comment, event_startdate, event_enddate, event_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  // Eksempeldata for events-tabellen
  const eventData = [
    [1, 1, "Ole Morten", 2, "En kommentar til reservasjonen", "2023-12-12 09:44", "2023-12-12 19:44","reservation"],
    [2, 2, "Ole Morten", 2, "En annen kommentar til lånet", "2023-12-12 11:44", null, "loan"],
    [3, 3, "Ole Mortens nabo - Lucia", 1, "En nabo tenker sin egen kommentar til utlånet - og rapper den", "2023-12-13 09:45", null, "depreciation"],
    // ... andre rader ...
  ];

  eventData.forEach((event) => {
    const checkSql = "SELECT COUNT(*) AS count FROM events WHERE event_comment = ?";
    db.get(checkSql, [event[4]], (checkErr, row) => {
      if (checkErr) {
        console.error(checkErr.message);
        return;
      }

      if (row.count === 0) {
        const insertSql = "INSERT INTO events (eq_id, eventuser_id, eventuser_name, event_quantity, event_comment, event_startdate, event_enddate, event_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        db.run(insertSql, event, (insertErr) => {
          if (insertErr) {
            console.error(insertErr.message);
          } else {
            console.log("Event data inserted");
          }
        });
      } else {
        console.log("Event already exists:", event[4]);
      }
    });
  });

  //createLoanOut ();
}

//---------LoanOut-----------------------------

function createLoanOut() {
  const createLoansSql = `
    CREATE TABLE IF NOT EXISTS loans (
      loan_id INTEGER PRIMARY KEY AUTOINCREMENT,
      eq_id INTEGER,
      loanuser_id INTEGER,
      loanuser_name TEXT,
      loan_quantity INTEGER,
      loan_comment TEXT,
      loan_date DATE,
      loan_startdate DATE,
      loan_enddate DATE,
      loan_type TEXT
    )`;

  db.run(createLoansSql, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Loans table created or already exists.");
      insertInitialLoanData();
    }
  });
}

function insertInitialLoanData() {
  const insertSql = `
    INSERT INTO loans (eq_id, loanuser_id, loanuser_name, loan_quantity, loan_comment, loan_startdate, loan_enddate, loan_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  // Eksempeldata for loan-tabellen
  const loanData = [
    [1, 1, "Ole Morten", 2, "En kommentar til reservasjonen", "2023-12-12 09:44", "2023-12-12 19:44","utlån"],
    [2, 2, "Ole Morten", 2, "En annen kommentar til lånet", "2023-12-12 11:44", null, "loan"],
    [3, 3, "Ole Mortens nabo - Lucia", 1, "En nabo tenker sin egen kommentar til utlånet - og rapper den", "2023-12-13 09:45", null, "depreciation"],
    // ... andre rader ...
  ];

  loanData.forEach((loan) => {
    const checkSql = "SELECT COUNT(*) AS count FROM loans WHERE loan_comment = ?";
    db.get(checkSql, [loan[4]], (checkErr, row) => {
      if (checkErr) {
        console.error(checkErr.message);
        return;
      }

      if (row.count === 0) {
        const insertSql = "INSERT INTO loans (eq_id, loanuser_id, loanuser_name, loan_quantity, loan_comment, loan_startdate, loan_enddate, loan_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        db.run(insertSql, loan, (insertErr) => {
          if (insertErr) {
            console.error(insertErr.message);
          } else {
            console.log("Loan data inserted");
          }
        });
      } else {
        console.log("Loan already exists:", loan[4]);
      }
    });
  });

  //createReturnLoan ();
}

//---------ReturnLoan-----------------------------

function createReturnLoan() {
  const createReturnloansSql = `
    CREATE TABLE IF NOT EXISTS returnloans (
      returnloan_id INTEGER PRIMARY KEY AUTOINCREMENT,
      eq_id INTEGER,
      returnloanuser_id INTEGER,
      returnloanuser_name TEXT,
      returnloan_quantity INTEGER,
      returnloan_comment TEXT,
      returnloan_date DATE,
      returnloan_startdate DATE,
      returnloan_enddate DATE,
      returnloan_type TEXT
    )`;

  db.run(createReturnloansSql, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Returnloans table created or already exists.");
      insertInitialReturnLoanData();
    }
  });
}

function insertInitialReturnLoanData() {
  const insertSql = `
    INSERT INTO returnloans (eq_id, returnloanuser_id, returnloanuser_name, returnloan_quantity, returnloan_comment, returnloan_startdate, returnloan_enddate, returnloan_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  // Eksempeldata for returns-tabellen
  const returnloanData = [
    [1, 1, "Ole Morten", 2, "En kommentar til reservasjonen", "2023-12-12 09:44", "2023-12-12 19:44","returnering"],
    [2, 2, "Ole Morten", 2, "En annen kommentar til lånet", "2023-12-12 11:44", null, "returnering"],
    [3, 3, "Ole Mortens nabo - Lucia", 1, "En nabo tenker sin egen kommentar til utlånet - og rapper den", "2023-12-13 09:45", null, "returnering"],
    // ... andre rader ...
  ];

  returnloanData.forEach((returnloan) => {
    const checkSql = "SELECT COUNT(*) AS count FROM returns WHERE return_comment = ?";
    db.get(checkSql, [returnloan[4]], (checkErr, row) => {
      if (checkErr) {
        console.error(checkErr.message);
        return;
      }

      if (row.count === 0) {
        const insertSql = "INSERT INTO returnloans (eq_id, reurnloanuser_id, returnloanuser_name, returnloan_quantity, returnloan_comment, returnloan_startdate, returnloan_enddate, returnloan_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        db.run(insertSql, returnloan, (insertErr) => {
          if (insertErr) {
            console.error(insertErr.message);
          } else {
            console.log("Return data inserted");
          }
        });
      } else {
        console.log("Return already exists:", returnloan[4]);
      }
    });
  });

  //createLoanOut ();
}


module.exports = db;