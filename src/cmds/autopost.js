const cron = require('node-cron');
const axios = require('axios');

module.exports = {
  config: {
    name: "autopost",
    description: "Automatically post a random cat fact every hour.",
    usage: "",
    cooldown: 0,
    role: 1,
    prefix: false
  },
  handleEvent: async (api) => {
    if (!isCronStarted) {
      startAutoPost(api);
      isCronStarted = true;
    }
  }
};

let isCronStarted = false;

function startAutoPost(api) {
  cron.schedule("0 * * * *", async function () {
    try {
      const response = await axios.get("https://catfact.ninja/fact");
      const catFact = response.data.fact;

      const message = `😺 𝗔𝗨𝗧𝗢𝗣𝗢𝗦𝗧 𝗖𝗔𝗧𝗙𝗔𝗖𝗧\n\n“${catFact}”`;

      const formData = {
        input: {
          composer_entry_point: "inline_composer",
          composer_source_surface: "timeline",
          idempotence_token: `${Date.now()}_FEED`,
          source: "WWW",
          message: {
            text: message,
          },
          audience: {
            privacy: {
              base_state: "EVERYONE",
            },
          },
          actor_id: api.getCurrentUserID(),
        },
      };

      const postResult = await api.httpPost(
        "https://www.facebook.com/api/graphql/",
        {
          av: api.getCurrentUserID(),
          fb_api_req_friendly_name: "ComposerStoryCreateMutation",
          fb_api_caller_class: "RelayModern",
          doc_id: "7711610262190099",
          variables: JSON.stringify(formData),
        }
      );

      const postID = postResult.data.story_create.story.legacy_story_hideable_id;
      const postLink = `https://www.facebook.com/${api.getCurrentUserID()}/posts/${postID}`;

      api.sendMessage(`😺 𝗔𝗨𝗧𝗢𝗣𝗢𝗦𝗧 𝗖𝗔𝗧𝗙𝗔𝗖𝗧\nLink: ${postLink}`, /* Specify the thread ID or recipient here */);
      console.log(`😺 𝗔𝗨𝗧𝗢𝗣𝗢𝗦𝗧 𝗖𝗔𝗧𝗙𝗔𝗖𝗧\nLink: ${postLink}`);
    } catch (error) {
      console.error("Error during auto-posting:", error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Manila",
  });
}
