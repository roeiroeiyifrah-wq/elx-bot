const {
  EmbedBuilder
} = require("discord.js");

const {
  loadData,
  saveData
} = require("../utils/save");


const QUEST_CHANNEL_ID =
"1529241574041719004";


module.exports = (client) => {


  let quests = loadData(
    "quests.json",
    {}
  );


  const possibleQuests = [

    {
      type: "chat",
      text: "💬 שלח 10 הודעות איכותיות",
      amount: 10,
      reward: 100
    },

    {
      type: "voice",
      text: "🎤 דבר 10 דקות בוויס",
      amount: 10,
      reward: 100
    },

    {
      type: "chat",
      text: "💬 שלח 30 הודעות איכותיות",
      amount: 30,
      reward: 250
    },

    {
      type: "voice",
      text: "🎤 דבר 30 דקות בוויס",
      amount: 30,
      reward: 250
    },

    {
      type: "chat",
      text: "💬 שלח 60 הודעות איכותיות",
      amount: 60,
      reward: 500
    },

    {
      type: "voice",
      text: "🎤 דבר שעה בוויס",
      amount: 60,
      reward: 500
    }

  ];



  function createQuests() {

    const list =
      [...possibleQuests]
      .sort(
        () => Math.random() - 0.5
      );


    return [
      list[0],
      list[1],
      list[2]
    ];

  }




  function getToday() {

    return new Date()
      .toLocaleDateString(
        "he-IL",
        {
          timeZone: "Asia/Jerusalem"
        }
      );

  }





  function resetDaily() {


    const today = getToday();



    if (
      quests.date !== today
    ) {


      quests = {

        date: today,

        list: createQuests(),

        users: {},

        sent: false

      };


      saveData(
        "quests.json",
        quests
      );


    }

  }





  async function sendQuestMessage() {


    if (
      quests.sent
    )
      return;



    const channel =
      await client.channels.fetch(
        QUEST_CHANNEL_ID
      )
      .catch(
        () => null
      );



    if (!channel)
      return;



    const embed =
      new EmbedBuilder()

      .setTitle(
        "🎯 משימות יומיות"
      )

      .setDescription(

        quests.list
        .map(
          (q,i) =>
          `${i + 1}. ${q.text}\n💎 פרס: ${q.reward} נקודות`
        )
        .join("\n\n")

      )

      .setFooter({

        text:
        "המשימות מתחלפות כל יום ב־00:00"

      });



    await channel.send({

      embeds: [embed]

    });



    quests.sent = true;



    saveData(
      "quests.json",
      quests
    );


  }





  client.once(
    "ready",
    async () => {


      resetDaily();


      await sendQuestMessage();


    }
  );





  setInterval(
    async () => {


      resetDaily();


      await sendQuestMessage();


    },
    60000
  );


};
