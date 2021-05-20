

//every players birthday activity

const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");

//global object for storing the data in json format
let playerFile = {};

request("https://www.espncricinfo.com/series/ipl-2021-1249214/punjab-kings-vs-delhi-capitals-29th-match-1254086/full-scorecard", callback);

function callback(error, response, html){
   if(!error) {
       const manipulationTool = cheerio.load(html);

       let allPlayerAnchors = manipulationTool(".Collapsible__contentInner tbody a.small");

       for(let i = 0; i < allPlayerAnchors.length; i++){
           let name = manipulationTool(allPlayerAnchors[i]).text();
           let link = "https://www.espncricinfo.com" + manipulationTool(allPlayerAnchors[i]).attr("href");

           players(name, link);

       }

   }

}

function players(name, link){
    request(link, function(error, response, html){
        const manipulationTool = cheerio.load(html);
        let list = manipulationTool(".player-card-description.gray-900");
        // console.log(manipulationTool(list[1]).text());
        // console.log(name);
        // console.log("--------------------------------------------------");
        playerFile[name] = manipulationTool(list[1]).text();
        fs.writeFileSync("playerFile.json", JSON.stringify(playerFile));

    });  
}