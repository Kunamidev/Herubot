module.exports = {
  config: {
    name: "hi",
    description: "Sends a greeting message.",
    usage: "hi",
    cooldown: 5,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    react("✅", event);
    reply(`Hello! 👋 How can I assist you today?`, event);
  }
};
