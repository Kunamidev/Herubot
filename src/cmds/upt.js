const os = require('os');
const process = require('process');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "upt",
    description: "Displays the bot's uptime along with system information.",
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

      const cpuUsage = process.cpuUsage().system / 1024 / 1024;
      const ramUsage = process.memoryUsage().rss / 1024 / 1024;
      const cores = os.cpus().length;
      const ping = Date.now() - event.timestamp;
      const platform = os.platform();
      const arch = os.arch();

      const currentTime = moment().tz("Asia/Manila").format("MMMM Do YYYY, h:mm:ss A");

      const message = `Heru Bot has been working for ${hours} hour(s), ${minutes} minute(s), ${seconds} second(s).\n\n` +
        `❖ Cpu usage: ${cpuUsage.toFixed(2)}%\n` +
        `❖ RAM usage: ${ramUsage.toFixed(2)} MB\n` +
        `❖ Cores: ${cores}\n` +
        `❖ Ping: ${ping}ms\n` +
        `❖ Operating System Platform: ${platform}\n` +
        `❖ System CPU Architecture: ${arch}\n\n` +
        `❖ Admin: Jay Mar\n` +
        `❖ VIP: Jay Mar\n\n` +
        `❖ Current Date and Time: ${currentTime}\n` +
        `❖ Developer: Jay Mar`;

      react("✅", event);
      await api.editMessage(message, checkingMessage.messageID);
    } catch (error) {
      react("❌", event);
      reply(`❗ An error occurred: ${error.message}`, event);
    }
  }
};
