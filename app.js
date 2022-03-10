//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { options } = require("request");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var firstName = req.body.first;
  var lastName = req.body.last;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  var jasonData = JSON.stringify(data);

  //   const appid = "eaac99123124b3767619219e22c02c54-us14";
  const url = "https://us14.api.mailchimp.com/3.0/lists/786f9921f2";
  //   const audianceId= "786f9921f2";

  const options = {
    method: "POST",
    auth: "Amit:eaac99123124b3767619219e22c02c54-us14",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      const emailData = JSON.parse(data);
      console.log(emailData.error_count);
      if (emailData.error_count > 0) {
        res.sendFile(__dirname + "/fail.html");
      } else {
        console.log(firstName + " " + lastName + " " + email);
        res.sendFile(__dirname + "/sucsess.html");
      }
    });
  });

  request.write(jasonData);
  request.end();
});

app.get("/fail", function (res, req) {
  req.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server start at port 3000");
});
