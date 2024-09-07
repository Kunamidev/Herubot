const axios = require('axios');

module.exports = {
  config: {
    name: "mixtral",
    description: "Fetches a response from the Mixtral AI based on the provided query.",
    usage: "mixtral <your query>",
    cooldown: 5,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    if (args.length === 0) {
      react("⚠️", event);
      return reply("Please provide a query.", event);
    }

    const query = args.join(" ");
    const apiUrl = `https://deku-rest-api.gleeze.com/api/mixtral-8b?q=${encodeURIComponent(query)}`;

    try {
      react("⏳", event);

      const searchingMessage = await new Promise(resolve => {
        api.sendMessage("⏳ Searching...", event.threadID, (err, info) => {
          resolve(info);
        });
      });

      const response = await axios.get(apiUrl);
      const data = response.data;
      const message = data.result || "No data found.";

      react("✅", event);
      await api.editMessage(
        `🌟 𝙼𝚒𝚡𝚝𝚛𝚊𝚕 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎\n━━━━━━━━━━━━━━━\n${message}`,
        searchingMessage.messageID
      );
    } catch (error) {
      react("❌", event);
      return reply("There was an error fetching data from the Mixtral API. Please try again later.", event);
    }
  }
};