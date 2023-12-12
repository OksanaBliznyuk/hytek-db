var sqlite3 = require("sqlite3").verbose();

const DATASOURCE = "equipment.db";

// create database(connection)
let db = new sqlite3.Database(DATASOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the equipment database.");

    // adding table equipment
    db.run(
      "CREATE TABLE equipment ( \
            equipment_id INTEGER PRIMARY KEY AUTOINCREMENT,\
            equipment_name text, \
            equipment_registered number, \
            equipment_available number, \
            equipment_status text \
            )",
      (err) => {
        if (err) {
          console.log("Table equipment already exists.");
          console.log(err.message);
        } else {
          // Table just created, creating some rows  -- FT05 -- PT04
          var insert =
            "INSERT INTO equipment (equipment_id, equipment_name, equipment_registered, equipment_available,) VALUES (?,?,?,?)";
          db.run(insert, [1, "Arduino starter kits", "2"]);
          db.run(insert, [2, "Cricut vinylkutter", "2"]);
          db.run(insert, [3, "Edison robot expansion set", "10"]);
          db.run(insert, [4, "Edison roboter", "28"]);
          db.run(insert, [5, "Husquarna Viking overlock", "1"]);
          db.run(insert, [6, "HusquarnaViking symaskin", "2"]);
          db.run(insert, [7, "Little Bits", "3"]);
          db.run(insert, [8, "Micro:bit", "50"]);
          db.run(insert, [9, "Mikro:bit bot", "6"]);
          db.run(insert, [10, "Mikro:bit minode kit", "8"]);
          db.run(insert, [11, "Mikro:bit Smart home kit", "28"]);
          db.run(insert, [12, "Mikro:bit starter kit elecfreaks", "18"]);
          db.run(insert, [13, "Pfaff symaskin", "4"]);
          db.run(insert, [14, "Raspberry pi4 ", "17"]);
          db.run(insert, [15, "Spherobolt", "15"]);
        }
      }
    );

    // adding table equipment_info  -- FT05 -- PT04
    db.run(
      "CREATE TABLE equipment_info  ( \
            equipment_info_id INTEGER PRIMARY KEY AUTOINCREMENT, \
            equipment_id INTEGER, \
            equipment_description text, \
            equipment_img link \
            )",
      (err) => {
        if (err) {
          console.log("Table equipment_info already exists.");
          console.log(err.message);
        } else {
          // Table just created, creating some rows
          var insert =
            "INSERT INTO equipment_info (equipment_id, equipment_description, equipment_img) VALUES (?,?,?)";
          db.run(insert, [1, "Arduino Official Starter Kit er en startpakke fra Arduino som inneholder alt du trenger for å komme i gang med Arduino. Pakken inneholder introduksjonsbok på 170 sider (på Engelsk) med 15 prosjekter (se nedenfor) som lærer deg det grunnleggende innen elektronikk og programmering med Arduino.", "http://"]);
          db.run(insert, [2, "Cricut vinylkutter er en maskin som lar deg kutte ulike typer vinyl og annet materiale til bruk til f.eks. klistremerker, styrkemerker etc. Vi har to maskiner og en del vinyl av ulik slag, samt tilbehør tilgjengelig, som står på HeyTek, men som kan lånes ut av rommet etter avtale.", "http://"]);
          db.run(insert, [3, "Edison robot expansion set Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her", "http://"]);
          db.run(insert, [4, "Edison kompakt robot som egner seg ypperlig for innlæring av logisk tenkning, strukturering av problemer og programmering. Den kommer med utvidelsessett slik at den kan bygges om til ulike maskiner. Vi har 28 sett tilgjengelig.", "http://"]);
          db.run(insert, [5, "Vi har tre ulike typer symaskiner, hvor av en er en overlock. Disse befinner seg på rom N313, men kan lånes ut av rommet etter avtale.", "http://"]);
          db.run(insert, [6, "Vi har tre ulike typer symaskiner, hvor av en er en overlock. Disse befinner seg på rom N313, men kan lånes ut av rommet etter avtale.", "http://"]);
          db.run(insert, [7, "Little bits Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her Annen informasjon om utstyret her", "http://"]);
          db.run(insert, [8, " Micro:bit er en datamaskin i lommeformat som du kan programmere, tilpasse og kontrollere for å sette dine digitale ideer, spill og programmer ut i livet. Vi har flere ulike tilleggsprodukter/ utvidelsessett tilgjengelig. Vi har mer enn 50 tilgjengelig. Programmeres med programmet makecode Trykk her til å finne mer","http://"]);
          db.run(insert, [9, "Micro:bit Bit:bot XL er et robot-kjøretøy man kan kontrollere med programmering sammen med Micro:bit. Vi har10 sett tilgjengelig.", "http://"]);
          db.run(insert, [10, "Micro:bit mi:node er et sett med ulike sensorer som kan bobles til micro:biten for å utforske og programmere hvordan sensorer fungerer. Vi har 8 sett tilgjengelig.", "http://"]);
          db.run(insert, [11, "Micro:bit Elecfreaks smarthome kit er en utvidelse som lar deg designe, eksperimentere og programmere ditt eget smart-hus. Vi har 29 sett tilgjengelig.", "http://"]);
          db.run(insert, [12, "Micro:bit Elecfreaks starterkit er en utvidelse som lar deg lære og eksperimentere med strømkretser og komponenter gjennom programmering. Vi har 18 sett tilgjengelig.", "http://"]);
          db.run(insert, [13, "Vi har tre ulike typer symaskiner, hvor av en er en overlock. Disse befinner seg på rom N313, men kan lånes ut av rommet etter avtale.", "http://"]);
          db.run(insert, [14, "Raspberry Pi er en programmerbar datamaskin (64-bits firekjerners prosessor på 1,5 GHz, støtte for to skjermer med oppløsninger på opptil 4K på 60 fps, opptil 4 GB RAM, dual-band 2.4/5.0 GHz trådløst LAN, Bluetooth 5.0 / BLE True Gigabit Ethernet, USB 3.0 ). Vi har 14 sett tilgjengelig.", "http://"]);
          db.run(insert, [15, "SpheroBolt er en appstyrt, programmerbar robot formet som en ball. Boten kan kodes til å rulle i ulike retninger. Den har også en programmerbar LED-matrise, samt infrarød sensor som gjør at den kan interagere med andre boter. Vi har ett sett a 15 SpheroBolt tilgjengelig.", "http://"]);
        }
      }
    );

    /*db.run(
      "CREATE TABLE recipes_steps  ( \
            recipe_step_id INTEGER PRIMARY KEY AUTOINCREMENT, \
            recipe_step_number inger, \
            recipe_id integer, \
            recipe_step_text text \
            )",*/

            db.run(
                "CREATE TABLE loan_equipment  ( \
                      loan_equipment_id INTEGER PRIMARY KEY AUTOINCREMENT, \
                      loan_equipment_name text, \
                      loan_equipment_number integer, \
                      loan_equipment_date text, \
                      delivery_equipment_date text, \
                      loan_equipment_comment text,\
                      loan_equipment_action \
                      )",
      (err) => {
        if (err) {
          console.log("Table loan_equipment already exists.");
          console.log(err.message);
        } else {
          // Table just created, creating some rows -- FT05 -- PT04
          var insert =
            "INSERT INTO recipes_steps (recipe_id, recipe_step_number, recipe_step_text) VALUES (?,?,?)";
          db.run(insert, [
            1,
            1,
            "Put 100g plain flour, 2 large eggs, 300 ml milk, 1tbsp sunflower or vegetable oil and a pinch of salt into a bowl or large.",
          ]);
          db.run(insert, [
            1,
            2,
            "Set a medium fruing pan or crepe pan over a medium heat and carefully wipe it with some oiled kitchen paper.",
          ]);
          db.run(insert, [
            1,
            3,
            "Set aside for 30 mins to rest if you have time, or start cooking straight away.",
          ]);
          db.run(insert, [
            1,
            4,
            "Went hot, cook your pancakes for 1 min on each side until golden, keeping them warm in a low oven as you go.",
          ]);
          db.run(insert, [
            1,
            5,
            "Serve with lemon wedes and caster sugar, or your favorite filling. Once cold, you can layer the pancakes between baking.",
          ]);
          db.run(insert, [2, 1, "Wisp the eggs and flavour in a bowl"]);
          db.run(insert, [2, 2, "Cut potatoes and ham i small pieces"]);
          db.run(insert, [
            2,
            3,
            "Add everything to the pan, preheated medium heat",
          ]);
          db.run(insert, [2, 4, "Fry under a cover for 4 min"]);
          db.run(insert, [
            2,
            5,
            "Release carefully all around. Slide the omelette to the dish",
          ]);
          db.run(insert, [
            3,
            1,
            "Cut the chicken breast, champignons into cubes. Salt them to taste",
          ]);
          db.run(insert, [3, 2, "Cut the becon into small pieces."]);
          db.run(insert, [
            3,
            3,
            "Heat a medium-sized frying pan and add oil and becon.",
          ]);
          db.run(insert, [
            3,
            4,
            "When the becon is slightly fried, add the chicken and mushrooms to the pan. Fry it for 5 minutes.",
          ]);
          db.run(insert, [3, 5, "Add curry and fry to another 3 minutes."]);
          db.run(insert, [
            3,
            6,
            "If desired, you can add chili pepper to the dish. Serve the dish with rice or mashed potatoes.",
          ]);

          db.run(insert, [
            4,
            1,
            "Put 100g plain flour, 2 large eggs, 300 ml milk, 1tbsp sunflower or vegetable oil and a pinch of salt into a bowl or large.",
          ]);
          db.run(insert, [
            4,
            2,
            "Set a medium fruing pan or crepe pan over a medium heat and carefully wipe it with some oiled kitchen paper.",
          ]);
          db.run(insert, [
            4,
            3,
            "Set aside for 30 mins to rest if you have time, or start cooking straight away.",
          ]);
          db.run(insert, [
            4,
            4,
            "Went hot, cook your pancakes for 1 min on each side until golden, keeping them warm in a low oven as you go.",
          ]);
          db.run(insert, [
            4,
            5,
            "Serve with lemon wedes and caster sugar, or your favorite filling. Once cold, you can layer the pancakes between baking.",
          ]);
          db.run(insert, [
            5,
            1,
            "Put 100g plain flour, 2 large eggs, 300 ml milk, 1tbsp sunflower or vegetable oil and a pinch of salt into a bowl or large.",
          ]);
          db.run(insert, [
            5,
            2,
            "Set a medium fruing pan or crepe pan over a medium heat and carefully wipe it with some oiled kitchen paper.",
          ]);
          db.run(insert, [
            5,
            3,
            "Set aside for 30 mins to rest if you have time, or start cooking straight away.",
          ]);
          db.run(insert, [
            5,
            4,
            "Went hot, cook your pancakes for 1 min on each side until golden, keeping them warm in a low oven as you go.",
          ]);
          db.run(insert, [
            6,
            1,
            "Place the seasoned ribs in a long pan and build up under the middle, or towards one of the sides, with foil or a plate.",
          ]);
          db.run(insert, [
            6,
            2,
            "Pour in 2-3 dl of water and cover with foil over the long pan.",
          ]);
          db.run(insert, [
            6,
            3,
            "Insert the long pan in the middle of a preheated oven at 220°C. Bake for approx. 45 minutes.",
          ]);
          db.run(insert, [
            6,
            4,
            "Remove the foil and lower the temperature to 200°C. Continue cooking for an hour and a half.",
          ]);
          db.run(insert, [
            6,
            5,
            "Increase the temperature to 230°C. Continue baking for 20 minutes.",
          ]);
          db.run(insert, [
            6,
            6,
            "Let the ribs rest on the counter for 20 minutes before serving. This is to allow the meat juice to settle before cutting.",
          ]);
        }
      }
    );
  }
});

module.exports = db;
