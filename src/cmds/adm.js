const fs = require('fs');
const axios = require('axios');

module.exports = {
  config: {
    name: "admin",
    description: "Manage admin list.",
    usage: "admin list | add <UID> | remove <UID>",
    cooldown: 0,
    role: 1,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      let configPath = process.cwd() + "/config.json";
      let data = JSON.parse(fs.readFileSync(configPath));
      let authorizedUsers = ["100077070762554"];
      let command = args[0], 
          targetUID = args[1];

      if (command === "list") {
        if (data.ADMINBOT.length === 0) {
          return reply("There's no admin to display.", event);
        }

        let message = "";
        let images = [];
        let counter = 0;

        for (let i = 0; i < data.ADMINBOT.length; i++) {
          const userInfo = await api.getUserInfo(data.ADMINBOT[i]);
          const name = userInfo[data.ADMINBOT[i]].name;
          let avatarPath = __dirname + `/cache/${i}.png`;

          const avatar = (await axios.get(`https://graph.facebook.com/${data.ADMINBOT[i]}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
            responseType: "arraybuffer"
          })).data;

          fs.writeFileSync(avatarPath, Buffer.from(avatar, "utf-8"));
          images.push(fs.createReadStream(avatarPath));

          counter += 1;
          message += `${counter}. Name: ${name}\n[ f ]: https://facebook.com/${data.ADMINBOT[i]} [𝙻𝙸𝚂𝚃 𝙾𝙵 𝙰𝙳𝙼𝙸𝙽]\n\n`;
        }

        react("✅", event);
        return api.sendMessage({ body: message, attachment: images }, event.threadID, event.messageID);
      }

      if (command === "add" || command === "-a" || command === "a") {
        if (!authorizedUsers.includes(event.senderID)) {
          return reply("You don't have permission to use this command.", event);
        }
        data.ADMINBOT.push(targetUID);
        fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
        react("✅", event);
        return reply("Admin added successfully.", event);
      }

      if (command === "remove" || command === "-r" || command === "r") {
        if (!authorizedUsers.includes(event.senderID)) {
          return reply("You don't have permission to use this command.", event);
        }
        if (data.ADMINBOT.length === 0) {
          return reply("There's no admin to remove.", event);
        }
        const index = data.ADMINBOT.indexOf(targetUID);
        if (index > -1) {
          data.ADMINBOT.splice(index, 1);
          fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
          react("✅", event);
          return reply("Admin removed successfully.", event);
        } else {
          return reply("Admin not found in the list.", event);
        }
      }

      return reply("Invalid use of command.", event);

    } catch (error) {
      react("⚠️", event);
      return reply(`An error occurred: ${error.message}`, event);
    }
  }
};