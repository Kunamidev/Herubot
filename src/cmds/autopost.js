const axios = require('axios');
const cron = require('node-cron');

module.exports = {
  config: {
    name: "autopost",
    description: "Automatically posts a random cat fact every 30 minutes.",
    usage: "autopost [on/off]",
    cooldown: 0,
    role: 1,
    prefix: false
  },
  run: async (api, event, args, reply, react) => {
    try {
      const isActive = args[0] === "on";
      const isInactive = args[0] === "off";

      if (isActive) {
        const task = cron.schedule("*/30 * * * *", async function () {
          react("⏳", event);
          const getfact = (await axios.get("https://catfact.ninja/fact")).data;
          const fact = getfact.fact;

          let uuid = getGUID();
          const formData = {
            input: {
              composer_entry_point: "inline_composer",
              composer_source_surface: "timeline",
              idempotence_token: uuid + "_FEED",
              source: "WWW",
              attachments: [],
              audience: {
                privacy: {
                  allow: [],
                  base_state: "EVERYONE",
                  deny: [],
                  tag_expansion_state: "UNSPECIFIED",
                },
              },
              message: {
                ranges: [],
                text: `𝚁𝙰𝙽𝙳𝙾𝙼 𝙲𝙰𝚃 𝙵𝙰𝙲𝚃: “${fact}”`,
              },
              inline_activities: [],
              explicit_place_id: "0",
              text_format_preset_id: "0",
              logging: {
                composer_session_id: uuid,
              },
              tracking: [null],
              actor_id: api.getCurrentUserID(),
              client_mutation_id: Math.floor(Math.random() * 17),
            },
            displayCommentsFeedbackContext: null,
            displayCommentsContextEnableComment: null,
            displayCommentsContextIsAdPreview: null,
            displayCommentsContextIsAggregatedShare: null,
            displayCommentsContextIsStorySet: null,
            feedLocation: "TIMELINE",
            feedbackSource: 0,
            focusCommentID: null,
            gridMediaWidth: 230,
            groupID: null,
            scale: 3,
            privacySelectorRenderLocation: "COMET_STREAM",
            renderLocation: "timeline",
            useDefaultActor: false,
            inviteShortLinkKey: null,
            isFeed: false,
            isFundraiser: false,
            isFunFactPost: false,
            isGroup: false,
            isTimeline: true,
            isSocialLearning: false,
            isPageNewsFeed: false,
            isProfileReviews: false,
            isWorkSharedDraft: false,
            UFI2CommentsProvider_commentsKey: "ProfileCometTimelineRoute",
            hashtag: null,
            canUserManageOffers: false,
          };
          const form = {
            av: api.getCurrentUserID(),
            fb_api_req_friendly_name: "ComposerStoryCreateMutation",
            fb_api_caller_class: "RelayModern",
            doc_id: "7711610262190099",
            variables: JSON.stringify(formData),
          };

          api.httpPost("https://www.facebook.com/api/graphql/", form, (e, info) => {
            try {
              if (e) throw e;
              if (info.error) throw info.error;
              if (typeof info === "string")
                info = JSON.parse(info.replace("for (;;);", ""));
              const postID = info.data.story_create.story.legacy_story_hideable_id;
              if (!postID) throw new Error("No post ID returned.");
              api.sendMessage(
                `[AUTO POST]\nLink: https://www.facebook.com/${api.getCurrentUserID()}/posts/${postID}`,
                api.getCurrentUserID()
              );
              console.log(`[AUTO POST]\nLink: https://www.facebook.com/${api.getCurrentUserID()}/posts/${postID}`);
              react("✅", event);
            } catch (e) {
              console.error('Error posting:', e.message);
              react("⚠️", event);
            }
          });
        }, {
          scheduled: true,
          timezone: "Asia/Manila",
        });

        reply("Auto-posting is now enabled.", event);
      } else if (isInactive) {
        cron.getTasks().forEach(task => task.stop());
        reply("Auto-posting is now disabled.", event);
      } else {
        reply("Invalid argument. Use 'autopost on' to enable or 'autopost off' to disable.", event);
      }
    } catch (error) {
      react("⚠️", event);
      reply(`An error occurred: ${error.message}`, event);
    }
  }
};
