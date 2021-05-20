
//last ball comment activity

const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");

request("https://www.google.com/", callback);

function callback(error, response, html){
   if(!error) {
       const manipulationTool = cheerio.load(html);

       let comment = manipulationTool(".ecample-selector").text();

       console.log(coment);
       
   }
}