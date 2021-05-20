// Requiring cheerio, request and fs modules
const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");
// Creating a global data object to store topicProcessor,projects and their issues. Will be used later to create a json file . This object will contain all issues and their links
let data = {};
//First request sent to topics page of github.
request("https://github.com/topics" , callback);

function callback(error, response, html){
    if(!error){
        const manipulationTool = cheerio.load(html);

        let allTopicAnchors = manipulationTool(".no-underline.d-flex.flex-column");

        for(let i = 0; i < allTopicAnchors.length; i++){

            topicUrl = ("https://github.com" + manipulationTool(allTopicAnchors[i]).attr("href"));

            projectName = (manipulationTool(manipulationTool(allTopicAnchors[i]).find("p")[0]).text().trim());

            topicPracessor(topicUrl, projectName);
        }
    }
}

function topicPracessor(topicUrl, topicName){
    request(topicUrl, function(error, response, html){
        if(!error){
            const manipulationTool = cheerio.load(html);
            let allHeadings = manipulationTool(".f3.color-text-secondary.text-normal.lh-condensed");
            allHeadings = allHeadings.slice(0,5);
            for(let i = 0; i < allHeadings.length; i++){

                if(!data[topicName]){
                    data[topicName] = [];
                    data[topicName].push({
                        name : manipulationTool(manipulationTool(allHeadings[i]).find("a")[1]).text().trim() , 
                    });
                }else{
                    data[topicName].push({
                        name : manipulationTool(manipulationTool(allHeadings[i]).find("a")[1]).text().trim() , 
                    });
                }
                projectProcessor("https://github.com" + manipulationTool(manipulationTool(allHeadings[i]).find("a")[1]).attr("href"),topicName, manipulationTool(manipulationTool(allHeadings[i]).find("a")[1]).text().trim());

                // console.log(manipulationTool(manipulationTool(allHeadings[i]).find("a")[1]).text().trim());
                // console.log("https://github.com" + manipulationTool(manipulationTool(allHeadings[i]).find("a")[1]).attr("href"));
            }

            

        }
    })
}

function projectProcessor(projectUrl, topicName, projectName){
    projectUrl = projectUrl + "/issues";

    request(projectUrl, function(error, response, html){
        let mt = cheerio.load(html);
        let allAnchors = mt(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
        let idx = -1;
        // console.log(projectName);
        for(let j = 0; j < data[topicName].length; j++){
            if(data[topicName][j].name == projectName){
                idx = j;
                break;
            }
        }
        allAnchors = allAnchors.slice(0,5);
        for(let i = 0; i < allAnchors.length; i++){
            let link = "https://github.com" + mt(allAnchors[i]).attr("href");
            let name = mt(allAnchors[i]).text();

            if(!data[topicName][idx].issues){
                data[topicName][idx].issues = [];
                data[topicName][idx].issues.push({ name , link});
            } else {
                data[topicName][idx].issues.push({ name , link});
            }
        }
        fs.writeFileSync("data.json",JSON.stringify(data));
    })
}