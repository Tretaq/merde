require("dotenv").config();
const axios = require("axios");

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/merde-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

// app.command("/merde-catfact", async ({ ack, respond }) => {
//   await ack();

//   try {
//     const response = await axios.get("https://catfact.ninja/fact");
//     await respond({ text: `Cat Fact:\n${response.data.fact}` });
//   } catch (err) {
//     await respond({ text: "Failed to fetch a cat fact." });
//   }
// });

app.command("/merde-search-monster", async({ command , ack , respond}) => {
  await ack();
  
  
  const argument = command.text.trim();
  console.log(argument);
  if(!argument){
    await respond('Please provide a topic! e.g. `/merde-fact owlbear`');
    return;
  }
  await respond({ text: `Written ${argument}` });


});

app.command("/merde-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/merde-ping - Check bot latency
/merde-catfact - Get a cat fact`
  });
});



(async () => {
  await app.start();
  console.log("bot is running!");
})();
