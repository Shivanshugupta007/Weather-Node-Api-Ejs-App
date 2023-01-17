const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

var cel = "";
var img = "images/default.jpg";
var desc = "";
var unit = "";
var city = "Your City"

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){

    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    var day = today.toLocaleDateString("en-US", options);

    res.render("weather", {cday: day, cond: cel, pho: img, det: desc, yaa: unit, cname: city});
});

app.post("/", function(req, res){
    
    
    var apiId = "edb722e51e5f25b3b81d9212bb639f8a";
    unit = req.body.units;
    city = req.body.city;
    console.log(unit);

    var url = "https://api.openweathermap.org/data/2.5/weather?q= " + city + "&units=" + unit + "&appid=" + apiId;

    https.get(url, function(response){
        console.log(response.statusCode);
        response.on("data", function(data){
            const jsonDATA = JSON.parse(data);
                    
            if (jsonDATA.main == undefined) {
                console.log("Invalid City");
                cel = "";
                city ="Invalid City"
                img = "images/default.jpg";
                desc = "";
                res.redirect("/");
            }
            else{
                console.log(jsonDATA.main.temp);
                const description = jsonDATA.weather[0].description;
                const icon = jsonDATA.weather[0].icon;
                const url2 = "http://openweathermap.org/img/wn/" + icon + "@4x.png"

                cel = jsonDATA.main.temp;
                
                img = url2;
                desc = description;
    
                res.redirect("/");

            }

        })
    })
})



app.listen(3000, function(){
    console.log("Server Running At 3000 Port");
});