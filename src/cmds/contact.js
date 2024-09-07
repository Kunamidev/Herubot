module.exports = {
  config: {
    name: "contact",
    description: "Shares the contact of the mentioned user or the user who sent the message.",
    usage: "contact [@mention or reply]",
    cooldown: 5,
    role: 0,
    prefix: false
  },
  run: async (api, event, args, reply) => {
    const { messageReply, senderID, threadID, mentions } = event;

    if (senderID == api.getCurrentUserID()) return;

    try {
      const userID = Object.keys(mentions).length > 0
        ? Object.keys(mentions)[0]
        : args.length > 0
        ? args[0]
        : messageReply
        ? messageReply.senderID
        : senderID;

      api.shareContact("", userID, threadID);
    } catch (error) {
      reply(error.message, event);
    }
  }
};