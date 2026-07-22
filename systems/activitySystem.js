const {
  loadData,
  saveData
} = require("../utils/save");


module.exports = (client) => {


  let points =
    loadData("points.json", {});


  let quests =
    loadData("quests.json", {});


  let chatCount = {};

  // משתמשים שבאמת מדברים בוויס
  let voiceSpeaking = {};



  function addPoints(userId, amount) {

    if (!points[userId])
      points[userId] = 0;


    points[userId] += amount;


    saveData(
      "points.json",
      points
    );

  }




  async function completeQuest(
    user,
    quest,
    index
  ) {


    if (!quests.users)
      quests.users = {};


    if (!quests.users[user.id]) {

      quests.users[user.id] = {
        completed: []
      };

    }



    const data =
      quests.users[user.id];



    if (
      data.completed.includes(index)
    )
      return;



    data.completed.push(index);



    addPoints(
      user.id,
      quest.reward
    );



    saveData(
      "quests.json",
      quests
    );



    try {

      await user.send(
`🏆 השלמת משימה!

${quest.text}

💎 קיבלת ${quest.reward} נקודות`
      );

    } catch {}



    // בונוס סיום הכול

    if (
      data.completed.length === 3
    ) {


      addPoints(
        user.id,
        250
      );


      try {

        await user.send(
`👑 סיימת את כל המשימות!

🎁 בונוס:
+250 נקודות`
        );

      } catch {}

    }

  }




  // 💬 הודעות צ'אט

  client.on(
    "messageCreate",
    async message => {


      if (message.author.bot)
        return;



      const words =
        message.content
        .trim()
        .split(/\s+/);



      // פחות מ-3 מילים לא נחשב

      if (
        words.length < 3
      )
        return;



      if (
        !chatCount[message.author.id]
      ) {

        chatCount[message.author.id] = 0;

      }



      chatCount[message.author.id]++;



      quests.list?.forEach(
        async (quest,index) => {


          if (
            quest.type === "chat" &&
            chatCount[message.author.id]
            >= quest.amount
          ) {


            await completeQuest(
              message.author,
              quest,
              index
            );


          }


        }
      );


    }
  );





  // 🎤 בדיקת דיבור בוויס

  client.on(
    "voiceStateUpdate",
    (oldState,newState) => {


      const member =
        newState.member ||
        oldState.member;


      if (
        !member ||
        member.user.bot
      )
        return;



      // התחיל לדבר

      if (
        !oldState.suppress &&
        newState.suppress
      ) {

        voiceSpeaking[member.id] = false;

      }


      // יש שינוי קול
      if (
        oldState.channelId ||
        newState.channelId
      ) {

        voiceSpeaking[member.id] = true;

      }


    }
  );





  // כל דקה

  setInterval(
    async () => {


      quests =
        loadData(
          "quests.json",
          {}
        );



      for (
        const userId in voiceSpeaking
      ) {


        // אם דיבר בדקה הזאת

        if (
          voiceSpeaking[userId]
        ) {


          const user =
            await client.users.fetch(
              userId
            ).catch(
              () => null
            );



          if (!user)
            continue;



          if (
            !voiceSpeaking[userId + "_minutes"]
          ) {

            voiceSpeaking[userId + "_minutes"] = 0;

          }



          voiceSpeaking[userId + "_minutes"]++;



          quests.list?.forEach(
            async (quest,index) => {


              if (
                quest.type === "voice" &&
                voiceSpeaking[userId + "_minutes"]
                >= quest.amount
              ) {


                await completeQuest(
                  user,
                  quest,
                  index
                );


              }


            }
          );


        }



        // איפוס הדקה

        voiceSpeaking[userId] = false;


      }



    },
    60000
  );


};
