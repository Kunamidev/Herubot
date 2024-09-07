const axios = require('axios');

module.exports = {
  config: {
    name: "ai",
    description: "Generates responses in different modes: Creative, Balanced, or Precise.",
    usage: "ai <mode> <prompt>",
    cooldown: 5,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {

      const mode = args[0];
      if (!["1", "2", "3"].includes(mode)) {
        throw new Error("Please provide a valid mode:\n1: Creative\n2: Balanced\n3: Precise\nExample: ai 1 hello");
      }

      const modeMap = {
        "1": "Creative",
        "2": "Balanced",
        "3": "Precise"
      };

      const prompt = args.slice(1).join(" ");
      if (!prompt) {
        react("⚠️", event);
        throw new Error("Please provide a prompt.");
      }

      const searchingMessage = await new Promise(resolve => {
        react("⏳", event);
        api.sendMessage('⏳ Searching...', event.threadID, (err, info) => {
          resolve(info);
        });
      });

      const response = await axios.get('https://deku-rest-api.gleeze.com/bing', {
        params: {
          prompt: prompt,
          mode: modeMap[mode]
        }
      });

      react("✅", event);
      await api.editMessage(
        `🌟 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲(${modeMap[mode]})\n━━━━━━━━━━━━━━━\n${response.data.bing}`,
        searchingMessage.messageID
      );

    } catch (error) {
      react("⚠️", event);
      reply(`❗ ${error.message}`, event);
    }
  }
};
