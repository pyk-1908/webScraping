
//max wicket activity

const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");

request("https://www.espncricinfo.com/series/ipl-2021-1249214/punjab-kings-vs-delhi-capitals-29th-match-1254086/full-scorecard", callback);

function callback(error, response, html){
   if(!error) {
       const manipulationTool = cheerio.load(html);
 
    //    let comments = manipulationTool(".col-14.col-md-15.col-lg-14 .match-comment-long-text p");

    //    let reqComment = manipulationTool(comments[0]).text();

    //    console.log(reqComment);

    let bothTables = manipulationTool(".table.bowler");
    
    let player = "";
    let maxWicket = 0;

    for(let i = 0; i < bothTables.length; i++){
        let tableRows = manipulationTool(bothTables[i]).find("tbody tr");
        for(let j = 0; j < tableRows.length; j++){

            allRowCols = manipulationTool(tableRows[j]).find("td");
            let currPlayer = manipulationTool(allRowCols[0]).text();
            let currWicket = manipulationTool(allRowCols[4]).text();

            if(maxWicket < currWicket){
                maxWicket = currWicket;
                player = currPlayer;
            }
        }
    }
    console.log(player + " " + "->" + " " + maxWicket);

       
   }
}