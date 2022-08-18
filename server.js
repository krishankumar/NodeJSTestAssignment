"use strict";

const Hapi = require("@hapi/hapi");
const https = require("https");
const curl = require("curl");
const request = require("request");
const { Module } = require("module");

(async () => {
  var serverOption = {
    host: "0.0.0.0",
    port: "5007",
    routes: {
      cors: {
        origin: ["*"],
        additionalHeaders: ["x-logintoken"],
        //headers: ["Content-Type"],
        additionalExposedHeaders: ["x-logintoken"],
      },
    },
  };

  const server = await Hapi.Server(serverOption);

  try {

    //1. HTTP Request Handling
    request(
      "https://rickandmortyapi.com/api/episode",
      function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var data = JSON.parse(response.body);

          var arr = data.results;
          //Replace URLs in “characters” array with character JSON objects taken from API
          arr.forEach(function (item, index) {
            arr[index] = {
              id: item.id,
              name: item.name,
              air_date: item.air_date,
              episode: item.episode,
              url: item.url,
              created: item.created,
              character: Object.assign({}, item.characters),
            };
          });
          console.log(arr); // Log final array into console
        }
      }
    );

    //3. Services Interaction

    function asyncProcessEvent(name: string): Promise<string> {
        /** do some ServiceA business logic
         * 
         * 
           //We can write some business login fro the serviceA
                3 Way to comunicate services 
                  1.HTTP communication
                  2.Message communication
                  3.Event-driven communication

            1) What options do we have to establish such communication?  
            2) For each option describe what are the pros and cons of this solution?
            3) For each option describe what are the cases the solution fits best?

        */



        /**
         * call ServiceB to run some different business logic
        */
        let snsClient = new Class.function()
        let params = {
            Message: JSON.stringify({
                'event': 'service-a-event'
            }),
            TopicArn: 'our-sns-topic-message-broker'
        }
    
        return snsClient.publish(params)
            .then((response) => {
                return response.MessageId
            })
    }

    //4. Database Structure

        //https://lucid.app/lucidchart/33db89b5-018d-4e22-8191-a69030926f85/edit?invitationId=inv_871af8fe-2a38-4029-b256-3bbbab443988&page=0_0#  
        //ER Diagrame: https://prnt.sc/aBZJTP_HxU8L


    await server.start();
    console.log("\nSERVER RUNNING AT :", server.info);

    //server.route(require('./src/donor/route'));
    // server.route(require('./src/charity/route'));
    //server.route(require('./src/stripe/route'));
  } catch (err) {
    console.log("\nERROR WHILE STARTING SERVER :", err);
    process.exit(1);
  }
})();
