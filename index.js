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
app.command("/merde-search-monster", async ({ command, ack, respond }) => {
  await ack();
  const monsterName = command.text.trim();

  if (!monsterName) {
    await respond('Please provide a topic! e.g. `/merde-search-monster owlbear`');
    return;
  }
  try {
    const response = await axios.get("https://www.dnd5eapi.co/api/2014/monsters");
    const monsters = response.data.results;

    const matched_monster = monsters.find(
      (monster) => monster.name.toLowerCase() === monsterName.toLowerCase()
    );
    if (matched_monster) {
      const detail = await axios.get(`https://www.dnd5eapi.co${matched_monster.url}`);

      const text = [
        `*Name:* ${detail.data.name}`,
        detail.data.size ? `*Size:* ${detail.data.size}` : null,
        detail.data.type ? `*Type:* ${detail.data.type}` : null,
        detail.data.hit_points !== undefined ? `*HP:* ${detail.data.hit_points}` : null,
        detail.data.armor_class?.length ? `*AC:* ${detail.data.armor_class[0].value}` : null,
        detail.data.speed?.walk ? `*Speed:* ${detail.data.speed.walk}` : null,
        `*Attributes:*\n   Strength: ${detail.data.strength}\n   Dexterity: ${detail.data.dexterity}\n   Constitution: ${detail.data.constitution}\n   Intelligence: ${detail.data.intelligence}\n   Wisdom: ${detail.data.wisdom}\n   Charisma: ${detail.data.charisma}`,
      ].filter(Boolean).join('\n');

      const blocks = [
        {
          type: "section",
          text: { type: "mrkdwn", text }
        }
      ];

      if (detail.data.image) {
        blocks.push({
          type: "image",
          image_url: `https://www.dnd5eapi.co${detail.data.image}`,
          alt_text: detail.data.name
        });
      }

      await respond({ blocks });
    } else {
      await respond({ text: `No monster found named "${monsterName}"` });
    }
  } catch (err) {
    console.error(err);
    await respond({ text: "Failed to fetch monster info." });
  }
});
app.command("/merde-search-random-monster", async ({ command, ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://www.dnd5eapi.co/api/2014/monsters");
    const monsters = response.data.results;
    const randomMonster = monsters[Math.floor(Math.random() * monsters.length)];
    console.log(randomMonster.url);
    const detail = await axios.get(`https://www.dnd5eapi.co${randomMonster.url}`);

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Name:* ${detail.data.name}\n*Size:* ${detail.data.size}\n*Type:* ${detail.data.type}\n*HP:* ${detail.data.hit_points}\n*AC:* ${detail.data.armor_class[0].value}\n*Speed:* ${detail.data.speed.walk}\n*Attributes:*\n   Strength: ${detail.data.strength}\n   Dexterity: ${detail.data.dexterity}\n   Constitution: ${detail.data.constitution}\n   Intelligence: ${detail.data.intelligence}\n   Wisdom: ${detail.data.wisdom}\n   Charisma: ${detail.data.charisma}`
        }
      }
    ];

    if (detail.data.image) {
      blocks.push({
        type: "image",
        image_url: `https://www.dnd5eapi.co${detail.data.image}`,
        alt_text: detail.data.name
      });
    }

    await respond({ blocks });
  } catch (error) {
    console.error(error); 
    await respond({ text: "Something went wrong :<" });
  }
});
app.command("/merde-search-equipment", async ({ command, ack, respond }) => {
  await ack();
  const itemName = command.text.trim();
  if (!itemName) {
    await respond('Please provide a topic! e.g. `/merde-search-equipment crossbow, heavy`');
    return;
  }
  try {
    const response = await axios.get("https://www.dnd5eapi.co/api/2014/equipment");
    const equipment = response.data.results;
    const matched_equipment = equipment.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase()
    );
    if (matched_equipment) {
      const detail = await axios.get(`https://www.dnd5eapi.co${matched_equipment.url}`);

      const text = [
        `*Name:* ${detail.data.name}`,
        detail.data.weapon_category ? `*Weapon Category:* ${detail.data.weapon_category}` : null,
        detail.data.weapon_range ? `*Weapon Range:* ${detail.data.weapon_range}` : null,
        detail.data.cost ? `*Cost:* ${detail.data.cost.quantity}${detail.data.cost.unit}` : null,
        detail.data.damage ? `*Damage:* ${detail.data.damage.damage_dice} ${detail.data.damage.damage_type.name}` : null,
        detail.data.range ? `*Range:* ${detail.data.range.normal}/${detail.data.range.long}` : null,
        detail.data.weight ? `*Weight:* ${detail.data.weight} lb` : null,
        detail.data.properties?.length ? `*Properties:* ${detail.data.properties.map(p => p.name).join(', ')}` : null,
      ].filter(Boolean).join('\n');

      const blocks = [
        {
          type: "section",
          text: { type: "mrkdwn", text }
        }
      ];

      if (detail.data.image) {
        blocks.push({
          type: "image",
          image_url: `https://www.dnd5eapi.co${detail.data.image}`,
          alt_text: detail.data.name
        });
      }

      await respond({ blocks });
    } else {
      await respond({ text: `No item found named "${itemName}"` });
    }
  } catch (err) {
    console.error(err);
    await respond({ text: "Failed to fetch equipment info." });
  }
});
app.command("/merde-search-random-equipment", async ({ command, ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://www.dnd5eapi.co/api/2014/equipment");
    const equipments   = response.data.results;
    const randomEquipments = equipments[Math.floor(Math.random() * equipments.length)];
    const detail = await axios.get(`https://www.dnd5eapi.co${randomEquipments.url}`);

    const text = [
          `*Name:* ${detail.data.name}`,
          detail.data.weapon_category ? `*Weapon Category:* ${detail.data.weapon_category}` : null,
          detail.data.weapon_range ? `*Weapon Range:* ${detail.data.weapon_range}` : null,
          detail.data.cost ? `*Cost:* ${detail.data.cost.quantity}${detail.data.cost.unit}` : null,
          detail.data.damage ? `*Damage:* ${detail.data.damage.damage_dice} ${detail.data.damage.damage_type.name}` : null,
          detail.data.range ? `*Range:* ${detail.data.range.normal}/${detail.data.range.long}` : null,
          detail.data.weight ? `*Weight:* ${detail.data.weight} lb` : null,
          detail.data.properties?.length ? `*Properties:* ${detail.data.properties.map(p => p.name).join(', ')}` : null,
        ].filter(Boolean).join('\n');
        const blocks = [
            {
              type: "section",
              text: { type: "mrkdwn", text }
            }
          ];
          if (detail.data.image) {
            blocks.push({
              type: "image",
              image_url: `https://www.dnd5eapi.co${detail.data.image}`,
              alt_text: detail.data.name
            });
          }
          await respond({ blocks });
  } catch (error) {
    console.error(error); 
    await respond({ text: "Something went wrong :<" });
  }
});


app.command("/merde-search-spells", async ({ command, ack, respond }) => {
  await ack();
  const itemSpells = command.text.trim();
  if (!itemSpells) {
    await respond('Please provide a topic! e.g. `/merde-search-spells fear`');
    return;
  }
  try {
    const response = await axios.get("https://www.dnd5eapi.co/api/2014/spells");
    const spells = response.data.results;
    const matched_spells = spells.find(
      (spell) => spell.name.toLowerCase() === itemSpells.toLowerCase()
    );
    if (matched_spells) {
      const detail = await axios.get(`https://www.dnd5eapi.co${matched_spells.url}`);

      const text = [
        `*Name:* ${detail.data.name}`,
        detail.data.school ? `*School:* ${detail.data.school.name}` : null,
        detail.data.level !== undefined ? `*Level:* ${detail.data.level}` : null,
        detail.data.casting_time ? `*Casting Time:* ${detail.data.casting_time}` : null,
        detail.data.range ? `*Range:* ${detail.data.range}` : null,
        detail.data.components?.length ? `*Components:* ${detail.data.components.join(', ')}` : null,
        detail.data.duration ? `*Duration:* ${detail.data.duration}` : null,
        `*Concentration:* ${detail.data.concentration ? 'Yes' : 'No'}`,
        `*Ritual:* ${detail.data.ritual ? 'Yes' : 'No'}`,
        detail.data.damage?.damage_at_character_level
          ? `*Damage:* ${Object.values(detail.data.damage.damage_at_character_level)[0]} ${detail.data.damage.damage_type.name}`
          : null,
        detail.data.classes?.length ? `*Classes:* ${detail.data.classes.map(c => c.name).join(', ')}` : null,
        detail.data.desc?.length ? `*Description:* ${detail.data.desc.join(' ')}` : null,
      ].filter(Boolean).join('\n');

      const blocks = [
        {
          type: "section",
          text: { type: "mrkdwn", text }
        }
      ];

      if (detail.data.image) {
        blocks.push({
          type: "image",
          image_url: `https://www.dnd5eapi.co${detail.data.image}`,
          alt_text: detail.data.name
        });
      }

      await respond({ blocks });
    } else {
      await respond({ text: `No spell found named "${itemSpells}"` });
    }
  } catch (err) {
    console.error(err);
    await respond({ text: "Failed to fetch spell info." });
  }
});
app.command("/merde-search-random-spells", async({ command , ack , respond}) => {
  await ack();
  try {
    const response = await axios.get("https://www.dnd5eapi.co/api/2014/spells");
    const spells  = response.data.results;
    const randomSpells = spells[Math.floor(Math.random() * spells.length)];
    const detail = await axios.get(`https://www.dnd5eapi.co${randomSpells.url}`);

    const text = [
            `*Name:* ${detail.data.name}`,
            detail.data.school ? `*School:* ${detail.data.school.name}` : null,
            detail.data.level !== undefined ? `*Level:* ${detail.data.level}` : null,
            detail.data.casting_time ? `*Casting Time:* ${detail.data.casting_time}` : null,
            detail.data.range ? `*Range:* ${detail.data.range}` : null,
            detail.data.components?.length ? `*Components:* ${detail.data.components.join(', ')}` : null,
            detail.data.duration ? `*Duration:* ${detail.data.duration}` : null,
            `*Concentration:* ${detail.data.concentration ? 'Yes' : 'No'}`,
            `*Ritual:* ${detail.data.ritual ? 'Yes' : 'No'}`,
            detail.data.damage ? `*Damage:* ${Object.values(detail.data.damage.damage_at_character_level)[0]} ${detail.data.damage.damage_type.name}` : null,
            detail.data.classes?.length ? `*Classes:* ${detail.data.classes.map(c => c.name).join(', ')}` : null,
            detail.data.desc?.length ? `*Description:* ${detail.data.desc.join(' ')}` : null,
          ].filter(Boolean).join('\n');

        const blocks = [
            {
              type: "section",
              text: { type: "mrkdwn", text }
            }
          ];
          if (detail.data.image) {
            blocks.push({
              type: "image",
              image_url: `https://www.dnd5eapi.co${detail.data.image}`,
              alt_text: detail.data.name
            });
          }
          await respond({ blocks });
  } catch (error) {
    console.error(error); 
    await respond({ text: "Something went wrong :<" });
  }
  

});



app.command("/merde-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/merde-ping - Check bot latency
/merde-search-monster - Get info about a selected monster
/merde-search-random-monster - Get info about a random monster`

  });
});



(async () => {
  await app.start();
  console.log("bot is running!");
})();
