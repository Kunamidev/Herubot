module.exports = {
  config: {
    name: "upt",
    description: "Displays the bot's uptime.",
    usage: "upt",
    cooldown: 0,
    role: 1,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      react("🟢", event);
      const checkingMessage = await new Promise(resolve => {
        api.sendMessage("🔴🔵🟠 Checking...", event.threadID, (err, info) => {
          resolve(info);
        });
      });

      const time = process.uptime();
      const hours = Math.floor(time / (60 * 60));
      const minutes = Math.floor((time % (60 * 60)) / 60);
      const seconds = Math.floor(time % 60);

      const message = `Heru bot is running ${hours} hour(s), ${minutes} minute(s), and ${seconds} second(s)`;

      react("✅", event);
      await api.editMessage(message, checkingMessage.messageID);
    } catch (error) {
      react("❌", event);
      reply(`❗ An error occurred: ${error.message}`, event);
    }
  }
};