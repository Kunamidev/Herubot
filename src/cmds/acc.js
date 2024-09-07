const axios = require('axios');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "acc",
    description: "Handles friend requests. Approve or list friend requests.",
    usage: "acc approve <UID> | acc",
    cooldown: 0,
    role: 1,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    const handleApprove = async (targetUID) => {
      const form = {
        av: api.getCurrentUserID(),
        fb_api_req_friendly_name: "FriendingCometFriendRequestConfirmMutation",
        doc_id: "3147613905362928",
        variables: JSON.stringify({
          input: {
            source: "friends_tab",
            actor_id: api.getCurrentUserID(),
            friend_requester_id: targetUID,
            client_mutation_id: Math.round(Math.random() * 19).toString(),
          },
          scale: 3,
          refresh_num: 0,
        }),
      };
      const success = [];
      const failed = [];
      try {
        const friendRequest = await axios.post(
          "https://www.facebook.com/api/graphql/",
          form
        );
        if (friendRequest.data.errors) failed.push(targetUID);
        else success.push(targetUID);
      } catch (e) {
        failed.push(targetUID);
      }
      return { success, failed };
    };

    if (args[0] === "approve") {
      if (args.length !== 2 || isNaN(args[1])) {
        return reply("Invalid syntax. Use: acc approve <UID>", event);
      }
      const targetUID = args[1];
      try {
        react("🟢", event);
        const { success, failed } = await handleApprove(targetUID);
        if (success.length > 0) {
          reply(`Approved friend request for UID ${success.join(", ")}`, event);
        }
        if (failed.length > 0) {
          reply(`Failed to approve friend request for UID ${failed.join(", ")}`, event);
        }
      } catch (error) {
        react("❌", event);
        reply(`❗ An error occurred: ${error.message}`, event);
      }
      return;
    }

    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
      fb_api_caller_class: "RelayModern",
      doc_id: "4499164963466303",
      variables: JSON.stringify({ input: { scale: 3 } }),
    };

    try {
      react("🟢", event);
      const listRequest = (await axios.post("https://www.facebook.com/api/graphql/", form)).data.data.viewer.friending_possibilities.edges;
      let msg = "";
      let i = 0;
      for (const user of listRequest) {
        i++;
        msg +=
          `\n${i}. Name: ${user.node.name}` +
          `\nID: ${user.node.id}` +
          `\nUrl: ${user.node.url.replace("www.facebook", "fb")}` +
          `\nTime: ${moment(user.time * 1000).tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss")}\n`;
      }
      react("✅", event);
      reply(`${msg}\nApprove friend request using UID: acc approve <UID>`, event);
    } catch (error) {
      react("❌", event);
      reply(`❗ An error occurred: ${error.message}`, event);
    }
  }
};