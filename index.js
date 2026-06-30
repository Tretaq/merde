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

  // try {
  //   const response = await axios.get("https://catfact.ninja/fact");
  //   await respond({ text: `Cat Fact:\n${response.data.fact}` });
  // } catch (err) {
  //   await respond({ text: "Failed to fetch a cat fact." });
  // }
// });
// await respond({ text: `Written ${argument}` });
app.command("/merde-search-monster", async({ command , ack , respond}) => {
  await ack();
  
  
  const monsterName = command.text.trim();

  if(!monsterName){
    await respond('Please provide a topic! e.g. `/merde-search-monster owlbear`');
    return;
  }
    try {
    const response = await axios.get("https://www.dnd5eapi.co/api/2014/monsters");
    const monsters = response.data.results;
    
    const matched_monster = monsters.find(
        (monster) => monster.name.toLowerCase() === monsterName
      );
      if (matched_monster) {
        const detail = await axios.get(`https://www.dnd5eapi.co${matched_monster.url}`);
        console.log(detail.data); 
          if (detail.data.image) {
            const imageUrl = `https://www.dnd5eapi.co${detail.data.image}`;
          }
        await respond({ 
          text: `Name: ${detail.data.name}\nSize: ${detail.data.size}\nType:  ${detail.data.type}\nHP: ${detail.data.hit_points}\nAC: ${detail.data.armor_class.value}\nSpeed: ${detail.data.speed.walk}\nAttributes:\n   Strength: ${detail.data.strength}\n   Dexterity: ${detail.data.dexterity}\n   Constitution: ${detail.data.constitution}\n   Intelligence: ${detail.data.intelligence}\n   Wisdom: ${detail.data.wisdom}\n   Charisma: ${detail.data.charisma}`
          
        });
      } else {
        await respond({ text: `No monster found named "${monsterName}"` });
      }

    // await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch monsters info." });
  }
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
