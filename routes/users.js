var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Supporter = require("../models/Supporter");
var Team = require("../models/Team");
var Collector = require("../models/Collector");
var Center = require("../models/Collect_center");
var { SendResetPasswordEmail } = require("../mailer");
var { ContactUsEmail } = require("../mailer");
var bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const axios = require('axios');
var multer = require("multer");
var path = require("path");
router.use(express.static(__dirname + "./public/"));
var cors = require("cors");
if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}
var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({
  storage: Storage,
}).single("file");

const client = new OAuth2Client(
  "991500253592-o6bt8lpeuisqg2fseal9uqhfqvft68k5.apps.googleusercontent.com"
);

/** LOGIN **/

router.get("/", function (req, res, next) {
  const username = req.query.username;
  const password = req.query.password;

  User.find(
    { $or: [{ Username: username }, { Email: username }] },
    async function (err, data) {
      if (err) throw err;
      if (data.length === 0) {
        return res.send("UserNotFound");
      } else if ((await bcrypt.compare(password, data[0].Password)) === false) {
        console.log("WrongPassword");
        return res.send("WrongPassword");
      } else {
        res.json(data);
      }
    }
  );
});

router.get("/login", function (req, res, next) {
  const email = req.body.Email;
  const password = req.body.Password;

  User.find(
    { $or: [{ Firstname: email }, { Email: email }] },
    async function (err, data) {
      if (err) throw err;
      if (data.length === 0) {
        console.log(data);
        return res.send("UserNotFound");
      } else if ((await bcrypt.compare(password, data[0].Password)) === false) {
        console.log("WrongPassword");
        return res.send("WrongPassword");
      } else {
        console.log(data[0].Role);
        Supporter.find(data[0]._id , function (err, doc) {
          if (err) {
            res.send(err);
          } else {
           if(data[0].Role=="Supporter"){
            var o2 = {_id: data[0]._id ,Role: data[0].Role,Email:data[0].Email,Firstname:doc[0].Firstname,Lastname:doc[0].Lastname,Avatar:doc[0].Avatar,Phone:doc[0].Phone,Date_birth:doc[0].Date_birth,Address:doc[0].Address,Team:doc[0].Team};
            res.send( o2);
          }
          else if(data[0].Role=="Team"){
            var o2 = {_id: data[0]._id ,Role: data[0].Role,Email:data[0].Email,Name:doc[0].Name,Sname:doc[0].Sname,Region:doc[0].Region,Phone:doc[0].Phone,Logo:doc[0].Logo,Address:doc[0].Address};
            res.send( o2);
          }

          else if(data[0].Role=="Collector"){
            var o2 = {_id: data[0]._id ,Role: data[0].Role,Email:data[0].Email,Name:doc[0].Name,Center:doc[0].Center,Phone:doc[0].Phone,Date_birth:doc[0].Date_birth,Address:doc[0].Address};
            res.send( o2);
          }
          else if(data[0].Role=="Center"){
            var o2 = {_id: data[0]._id ,Role: data[0].Role,Email:data[0].Email,Name:doc[0].Name,Phone:doc[0].Phone,Date_birth:doc[0].Date_birth,Address:doc[0].Address};
            res.send( o2);
          }


          }
        })
     

      }
    }
  );
});

router.get("/testih", function (req, res, next) {
  
   
  User.aggregate([
      // {$sort:{prix:{"prix":1}}},
     
       { $user: { createdAt: 0, __v: 0 } }

   ]).sort({"updatedAt":-1})
  
  .then(Supporter => {

     Ad.aggregate([
   
          { $user: {  createdAt: 0, __v: 0,lastUpdate:0} } ,
        ]).sort({"updatedAt":-1}).then((ad) => {
          console.log(ad);
          lastDateAd=Math.floor(new Date(ad[0].updatedAt).getTime()/1000); 
          ad.forEach(element => {
              element.updatedAt = Math.floor(new Date(element.updatedAt).getTime()/1000);
           });
          
          lastDate=Math.floor(new Date(products[0].updatedAt).getTime()/1000); 
      products.forEach(element => {
       
        element.pourcentage=round(element.pourcentage,2)
         element.updatedAt = Math.floor(new Date(element.updatedAt).getTime()/1000);
         
         //element.lastUpdate = Math.floor(new Date(element.lastUpdate).getTime()/1000);
        
         let arrPrix = element.prix
          arrPrix.forEach(element=>{
              element.updatedAt = Math.floor(new Date(element.updatedAt).getTime()/1000);
              
              
          })
          
      
       });

          res.send({status:200,lastDate, message: "All the products & Ads", products ,lastDateAd, ad});
        }).catch((err) => {
          return res.status(500).send({
              message: err.message || "Some error occurred while retrieving ads."
          });
        })
    
      
      
        

      
  }).catch(err => {
      return res.status(500).send({
          message: err.message || "Some error occurred while retrieving products."
      });
  });

 
});


/** Add User (Post Man)**/

router.post("/", async function (req, res, next) {
  const password = req.body.Password;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    Username: req.body.Username,
    Password: hashedPassword,
    Email: req.body.Email,
    Role: req.body.Role,
    img: req.body.img,
  });
  try {
    user.save();
    res.send("Ajout");
  } catch (error) {
    res.send(error);
  }
});
/** Add Supporter **/

router.post("/addsupp", upload, async function (req, res, next) {
  const obj = JSON.parse(JSON.stringify(req.body));
  const hashedPassword = await bcrypt.hash(obj.Password, 10);
  const supp = {
    Firstname: obj.Firstname,
    Lastname: obj.Lastname,
    Avatar: req.body.Avatar,
    Date_birth: obj.Date_birth,
    Address: obj.Address,
    Team: obj.Team,
    Phone: obj.Phone,
  };
  var ids;

  //console.log(mynewdelivery);

  Supporter.create(supp).then((d) => {
    (ids = d._id), console.log(ids);
    User.create({
      _id: d._id,
      Password: hashedPassword,
      Email: obj.Email,
      Role: "Supporter",
      Active:1,
    })
  });
  res.send("Done");
});
/** Add Team **/

router.post("/addteam", upload, async function (req, res, next) {
  const obj = JSON.parse(JSON.stringify(req.body));
  const hashedPassword = await bcrypt.hash(obj.Password, 10);
  const team = {
    Name: obj.Name,
    Sname: obj.Sname,
    Region: obj.Region,
    Address: obj.Address,
    Phone: obj.Phone,
    Logo: obj.Phone,

  };
  var ids;

  //console.log(mynewdelivery);

  Team.create(team).then((d) => {
    (ids = d._id), console.log(ids);
    User.create({
      _id: d._id,
      Password: hashedPassword,
      Email: obj.Email,
      Role: "Team",
      Active:1,
    })
  });
  res.send("Done");
});

/** Add Collector **/

router.post("/addCollector", upload, async function (req, res, next) {
  const obj = JSON.parse(JSON.stringify(req.body));
  const hashedPassword = await bcrypt.hash(obj.Password, 10);
  const collector = {
    Name: obj.Name,
    QrCode: obj.QrCode,
    Center: obj.Center,
    Phone: obj.Phone,
    Address: obj.Address,
    Date_birth: obj.Date_birth,
  };
  var ids;

  //console.log(mynewdelivery);

  Collector.create(collector).then((d) => {
    (ids = d._id), console.log(ids);
    User.create({
      _id: d._id,
      Password: hashedPassword,
      Email: obj.Email,
      Role: "Collector",
      Active:1,
    })
  });
  res.send("Done");
});

/** Add Collector **/

router.post("/addCenter", upload, async function (req, res, next) {
  const obj = JSON.parse(JSON.stringify(req.body));
  const hashedPassword = await bcrypt.hash(obj.Password, 10);
  const center = {
    Name: obj.Name,
    QrCode: obj.QrCode,
    Region: obj.Region,
    Phone: obj.Phone,
    Address: obj.Address,
  };
  var ids;

  //console.log(mynewdelivery);

  Center.create(center).then((d) => {
    (ids = d._id), console.log(ids);
    User.create({
      _id: d._id,
      Password: hashedPassword,
      Email: obj.Email,
      Role: "Center",
      Active:1,
    })
  });
  res.send("Done");
});
/** Reset User Password **/
router.post("/resetPassword", async function (req, res, next) {
  const { Email } = req.body;
  const user = await User.find({ Email: Email });
  try {
    if (user.length === 0) {
      return res.send("UserNotExist");
    }
    const resetCode = await ResetCode.find({ Id: user[0].Id });
    if (resetCode.length != 0) {
      res.send("EmailAlreadySent");
    } else {
      const code = user[0]._id.toString().substr(20, 24);
      const newResetCode = new ResetCode({ Id: user[0].Id, Code: code });
      await newResetCode.save();
      SendResetPasswordEmail(user[0].Email, user[0].Username, user[0].Id, code);

      res.send("EmailSended");
    }
  } catch (error) {
    res.send(error);
  }
});


/** Delete All Users **/
router.delete("/remove", function (req, res, next) {
  User.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Users were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
});

/** Get All Users **/

router.get("/usersAll", function (req, res, next) {
  User.find(function (err, data) {
    if (err) throw err;
    res.json(data);
  });
});
router.get("/getall", function (req, res, next) {
  User.find(function (err, data) {
    if (err) throw err;
    res.json(data);
  });
});
router.put("/dell/:id", async function (req, res) {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: { Role: 0 },
    },
    { new: true, useFindAndModify: false },
    function (err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send("Desactivated");
      }
    }
  );
});
router.put("/putuser/:id", async function (req, res) {
  const password = req.body.Password;
  var roles = "DRE";
  if(req.body.Role==""){
    roles="DRE";
  }
  else roles=req.body.Role
  const hashedPassword = await bcrypt.hash(password, 10);
  const obj = JSON.parse(JSON.stringify(req.body));
  const newuser = {
    Firstname: obj.Firstname,
    Lastname: obj.Lastname,
    Password:hashedPassword,
    Email: obj.Email,
    Role: roles,
    Active: 1
  };
  console.log(obj);
  User.findByIdAndUpdate(req.params.id, newuser, function (err) {
    if (err) throw err;
    res.send("done");
  });
});





router.post("/addxl/:email/:nom/:prenom/:pass",  async function (req, res, next) {
  const hashedPassword = await bcrypt.hash(req.params.pass, 10);
  async function init(id,user) {
    await sleep(3500);
    try {
      user.save();
    } catch (error) {
      res.send(error);
    }
    console.log(id);
  }
  
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  
 if(req.params.email !="undefined"){
  const params = {
    access_key: 'c997b63a4dd56e42fd1a4c581d378f6d',
    email: req.params.email,
    smpt:1,
    format:1
  }
  await axios.get('http://apilayer.net/api/check', {params})
  .then(response => {
     
    console.log(response.data.smtp_check);
    if(response.data.smtp_check==true){
  const user = new User({
    Firstname:req.params.nom,
    Lastname: req.params.prenom,
    Password: hashedPassword,
    Email: req.params.email,
    Role: "Admin",
    Active: 1,
  });

  
init(req.params.nom,user);
    }
  }).catch(error => {
    console.log(error);
  });
}
else (console.log("undef"))
  res.send("Done");
});



module.exports = router;
