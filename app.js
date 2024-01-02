var express = require("express");
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
// sql storage
var db = require("./db.js")

// listen on port 8099
const HTTP_PORT = 8099
app.listen(HTTP_PORT,() => {
    console.log("Server is listening on port " + HTTP_PORT);
});

// get equipment
app.get("/equipment", (req, res, next) => {
    var id = req.params.id
    var sql = "select equipment_id, equipment_name as name, equipment_registered as registered, equipment_available as available, equipment_status as status from equipment"
    var params = [id]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "equipment":rows
        })
      });
});


// get equipment_full
app.get("/equipment_full", (req, res, next) => {
  var id = req.params.id
  var sql = "select e.equipment_id, e.equipment_name as name, e.equipment_registered as registered, e.equipment_available as available, e.equipment_status as status, ei.equipment_description as description, ei.equipment_img as img from equipment e inner join equipment_info ei on e.equipment_id=ei.equipment_id order by e.equipment_id" 
  var params = [id]
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "equipment":rows
      })
    });
});


//FT01 - list recipes
app.get("/recipts", (req, res, next) => {
     // check if user is premium
    var id = req.params.id
    var sql = "select equipment_id, equipment_name as name, equipment_registered as registered, equipment_available as available, equipment_status as status from equipment" 
    var params = [id]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }

        var equipment = []
        rows.forEach(function (item) {
            // start of json object
            var equipment = {
                /*name: item.name,
                category: item.category,
                ingredients: [],
                steps: []*/

                name: item.name,
                registered: registered,
                available: available,
                status: status,
            }

            // lookup ingredients
            sql = "select recipe_ingredient_entry as entry, recipe_ingredient_type as type from recipes_ingredients where recipe_id = ?" 
            params = [item.recipe_id]
            db.all(sql, params, (err, ingredients) => {
                if (err) {
                  res.status(400).json({"error":err.message});
                  return;
                }
                ingredients.forEach (function (ingredient){
                    recipe.ingredients.push(ingredient)
                 });
            });

            // lookup steps
            sql = "select recipe_step_number as step_id, recipe_step_text as text from recipes_steps where recipe_id = ? order by recipe_step_number asc" 
            params = [item.recipe_id]
            db.all(sql, params, (err, steps) => {
                if (err) {
                  res.status(400).json({"error":err.message});
                  return;
                }
                steps.forEach (function (step){
                    recipe.steps.push(step)
                }); 
            });
            recipes.push(recipe);
      });
      setTimeout(function(){
        res.json(recipes);
        return;
      }, 2000)

})
});



// FT02 - overview of steps
app.get("/recipe/:recipe_id", (req, res, next) => {
    // check if user is premium
    var userType = req.get("user_type");
    var tier = "free";
    if (!((userType === "premium") || (userType === "admin"))) {
       tier = "free";
    }
    else { tier = "premium"}
   var recipe_id = req.params.recipe_id
   var sql = "select r.recipe_id, r.recipe_name as name, r.recipe_category as category, count(rs.recipe_step_id) as step_count from recipes r inner  join recipes_steps rs on r.recipe_id = rs.recipe_id where r.recipe_id = ?" 
   if (tier === "free") {
       sql = sql + " and r.recipe_category = 'free'"       
   }
   var params = [recipe_id]
   db.all(sql, params, (err, rows) => {
       if (err) {
         res.status(400).json({"error":err.message});
         return;
       }

       var recipes = []
       rows.forEach(function (item) {
           // start of json object
           var recipe = {
               name: item.name,
               ingredients: [],
               steps: item.step_count
           }

           // lookup ingredients
           sql = "select recipe_ingredient_entry as entry, recipe_ingredient_type as type from recipes_ingredients where recipe_id = ?" 
           params = [item.recipe_id]
           db.all(sql, params, (err, ingredients) => {
               if (err) {
                 res.status(400).json({"error":err.message});
                 return;
               }
               ingredients.forEach (function (ingredient){
                   recipe.ingredients.push(ingredient)
                });
           });

           recipes.push(recipe);
     });
     setTimeout(function(){
       res.json(recipes);
       return;
     }, 2000)

})
});


//FT03 - detailed steps
app.get("/recipe/:recipe_id/all", (req, res, next) => {
    // check if user is premium
    var userType = req.get("user_type");
    var tier = String;
    if (!((userType === "premium") || (userType === "admin"))) {
       tier = "free";
    }
    else { tier = "premium"}
   var recipe_id = req.params.recipe_id
   var sql = "select recipe_id, recipe_name as name, recipe_category as category from recipes where recipe_id = ?" 
   if (tier === "free") {
       sql = sql + " and recipe_category = 'free'"       
   }
   var params = [recipe_id]
   db.all(sql, params, (err, rows) => {
       if (err) {
         res.status(400).json({"error":err.message});
         return;
       }

       var recipes = []
       rows.forEach(function (item) {
           // start of json object
           var recipe = {
               name: item.name,
               category: item.category,
               ingredients: [],
               steps: []
           }

           // lookup ingredients
           sql = "select recipe_ingredient_entry as entry, recipe_ingredient_type as type from recipes_ingredients where recipe_id = ?" 
           params = [item.recipe_id]
           db.all(sql, params, (err, ingredients) => {
               if (err) {
                 res.status(400).json({"error":err.message});
                 return;
               }
               ingredients.forEach (function (ingredient){
                   recipe.ingredients.push(ingredient)
                });
           });

           // lookup steps
           sql = "select recipe_step_number as step_id, recipe_step_text as text from recipes_steps where recipe_id = ? order by recipe_step_number asc" 
           params = [item.recipe_id]
           db.all(sql, params, (err, steps) => {
               if (err) {
                 res.status(400).json({"error":err.message});
                 return;
               }
               steps.forEach (function (step){
                   recipe.steps.push(step)
               }); 
           });
           recipes.push(recipe);
     });
     setTimeout(function(){
       res.json(recipes);
       return;
     }, 2000)

})
});




//FT04 - single step
app.get("/recipe/:recipe_id/:step_id", (req, res, next) => {
    var recipe = req.params.recipe_id;
    var step = req.params.step_id;
    var sql = "select recipe_step_number as step_id, recipe_step_text from recipes_steps where recipe_id = ? and recipe_step_number=?" // where creditCardNumber = ?"//, req.params.cardNumber
    var params = [recipe, step]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "step":rows
        })
      });
});




 //PT02
 app.get("/search/:ingredient", (req, res, next) => {
    // check if user is premium
    var userType = req.get("user_type");
    if (!((userType === "premium") || (userType === "admin"))) {
        res.status(401).json({"error":"You have not suffisient privileges to this endpoint!"});
        return;
    }
    console.log("passed the checkpoint")
    // user is premium or admin, continuing
    var searchString = req.params.ingredient
    var sql = "select ('/recipe/' || recipe_id) as url from recipes_ingredients where recipe_ingredient_type = ?" 
    var params = [searchString]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "search":searchString,
            "results":rows
        })
      });
});

//PT03
app.get("/ingredients", (req, res, next) => {
  // check if user is premium
  var userType = req.get("user_type");
  if (!((userType === "premium") || (userType === "admin"))) {
      res.status(401).json({"error":"You have not suffisient privileges to this endpoint!"});
      return;
  }
    var sql = "select distinct recipe_ingredient_type from recipes_ingredients" 
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "ingredients":rows
        })
      });
});


// AT02 endpoint add/POST recipe -- starts here
app.post("/recipe", async (req, res, next) => {
// check if user is admin
var userType = req.get("user_type");
if (!(userType === "admin")) {
    res.status(401).json({"error":"You have not suffisient privileges to this endpoint!"});
    return;
}

    // save variables from request body
     var requestBody = req.body;
     var name =  requestBody.name;
     var category = requestBody.category;
     var ingredients = requestBody.ingredients;
     var steps = requestBody.steps;

     var recipe_id;

     //todo - quality check of incoming json

     // first add row to recipe table and get id for new row
     db.run(`INSERT INTO recipes (recipe_name, recipe_category) VALUES (?,?)`,
            [name, category], async function (err, recipe_id) {
             if (err) {
                 res.status(400).json({
                     "err": err.message
                 })      
             }
             recipe_id = this.lastID;  
             console.log('recipe_id:' + recipe_id);

             // then loop ingredients and add rows to table recipe_ingredients
             ingredients.forEach(function (item, index) {
                 db.run(`INSERT INTO recipes_ingredients (recipe_id, recipe_ingredient_entry, recipe_ingredient_type) VALUES (?,?,?)`,
                 [recipe_id, item.entry, item.type ])
                 }
                 );

                 console.log("finished ingredients");
             // then loop steps and add rows to table recipe_steps
             steps.forEach(function (item, index) {
                 db.run(`INSERT INTO recipes_steps (recipe_id, recipe_step_number, recipe_step_text) VALUES (?,?,?)`,
                 [recipe_id, item.step_id, item.text ])
                 }
                 );
                 console.log("in step loop");
            }
            );
            res.status(201).json({"success":"all good"});
  });


// AT03 - update recipe
app.patch("/recipe/:recipe_id", async (req, res, next) => {
     // check if user is admin
     var userType = req.get("user_type");
     if (!(userType === "admin")) {
         res.status(401).json({"error":"You have not suffisient privileges to this endpoint!"});
         return;
     }

    var recipe = req.params.recipe_id;

    // save variables from request body
    var requestBody = req.body;
    var name =  requestBody.name;
    var category = requestBody.category;
    var ingredients = requestBody.ingredients;
    var steps = requestBody.steps;
    var subString = ""
    var params1 = [];

     // update sent values

     if ((name) || (category)) {
        // update name or category
        console.log("name: " + name);
        console.log("category: " + category);

        if (name) { subString = "recipe_name = ?"; params1 = [name, recipe]};
        if ((name) && (category)) { subString = subString + ", "; params1 = [name, category, recipe]}
        if (category) { subString = subString + "recipe_category = ?"; if (!(name)) {params1=[category, recipe]}}
    var sql = "update recipes set " + subString + " where recipe_id = ?";
    console.log(sql);
    console.log(params1);
    db.run(sql, params1, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }

      });
     }

     if (ingredients) {
        ingredients.forEach(function (item, index) {
            db.run(`update recipes_ingredients set (recipe_id=?, recipe_ingredient_entry=?, recipe_ingredient_type=?`,
            [recipe, item.entry, item.type ])
            }
            );
        console.log(ingredients);
     }

     if (steps) {
        steps.forEach(function (item, index) {
            db.run(`update recipes_steps set recipe_id=?, recipe_step_number=?, recipe_step_text=? where recipe_id=? and recipe_step_number=?`,
            [recipe, item.step_id, item.text, recipe, item.step_id ])
            }
            );
        console.log(steps);
     }
     res.status(200).json({"success":"all good"});
});

// AT04 - replace recipe
app.put("/recipe/:recipe_id", async (req, res, next) => {
     // check if user is admin
     var userType = req.get("user_type");
     if (!(userType === "admin")) {
         res.status(401).json({"error":"You have not suffisient privileges to this endpoint!"});
         return;
     }

     var recipe = req.params.recipe_id;
     var params = [recipe];

     // save variables from request body
     var requestBody = req.body;
     var name =  requestBody.name;
     var category = requestBody.category;
     var ingredients = requestBody.ingredients;
     var steps = requestBody.steps;

     // delete existing
      // delete ingredients
    var sql = "delete from recipes_ingredients  where recipe_id = ?";
    db.run(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }

      });

    // delete steps
    var sql = "delete from recipes_steps  where recipe_id = ?";
    db.run(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }

      });

    // delete recipe
    var sql = "delete from recipes  where recipe_id = ?";
    db.run(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }

      });

     // add new
          // first add row to recipe table and get id for new row
          db.run(`INSERT INTO recipes (recipe_name, recipe_category) VALUES (?,?)`,
          [name, category], async function (err, recipe_id) {
           if (err) {
               res.status(400).json({
                   "err": err.message
               })      
           }
           recipe_id = this.lastID;  
           console.log('recipe_id:' + recipe_id);

           // then loop ingredients and add rows to table recipe_ingredients
           ingredients.forEach(function (item, index) {
               db.run(`INSERT INTO recipes_ingredients (recipe_id, recipe_ingredient_entry, recipe_ingredient_type) VALUES (?,?,?)`,
               [recipe_id, item.entry, item.type ])
               }
               );

               console.log("finished ingredients");
           // then loop steps and add rows to table recipe_steps
           steps.forEach(function (item, index) {
               db.run(`INSERT INTO recipes_steps (recipe_id, recipe_step_number, recipe_step_text) VALUES (?,?,?)`,
               [recipe_id, item.step_id, item.text ])
               }
               );
               console.log("in step loop");
          }
          );
          res.status(201).json({"success":"all good"});
});

// AT05 - delete recipe
app.delete("/recipe/:recipe_id", (req, res, next) => {
    // check if user is admin
    var userType = req.get("user_type");
    if (!(userType === "admin")) {
        res.status(401).json({"error":"You have not suffisient privileges to this endpoint!"});
        return;
    }

    var recipe = req.params.recipe_id;
    var params = [recipe];


    // delete ingredients
    var sql = "delete from recipes_ingredients  where recipe_id = ?";
    db.run(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }

      });

    // delete steps
    var sql = "delete from recipes_steps  where recipe_id = ?";
    db.run(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }

      });

    // delete recipe
    var sql = "delete from recipes  where recipe_id = ?";
    db.run(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }

      });

      res.json({
        "message":"success",
        "recipe_id": 'all for recipe ' + recipe + ' was deleted'
    })
});

 // temp helpers
 app.get("/all_recipes", (req, res, next) => {
    var id = req.params.id
    var sql = "select recipe_id, recipe_name, recipe_category from recipes"
    var params = [id]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "recipes":rows
        })
      });
});


app.get("/all_recipes_ingredients", (req, res, next) => {
    var id = req.params.id
    var sql = "select * from recipes_ingredients" 
    var params = [id]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "recipes_ingredients":rows
        })
      });
});


app.get("/all_recipes_steps", (req, res, next) => {
    var id = req.params.id
    var sql = "select * from recipes_steps order by recipe_id, recipe_step_number asc" 
    var params = [id]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "recipes_steps":rows
        })
      });
});