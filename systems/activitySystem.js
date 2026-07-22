const {
  loadData,
  saveData
} = require("../utils/save");


module.exports = (client) => {


  let quests =
    loadData(
      "quests.json",
      {}
    );


  let points =
    loadData(
      "points.json",
      {}
    );


  let chatCount = {};

  let voiceUsers = {};



  function addPoints(userId, amount){


    if(!points[userId])
      points[userId]=0;


    points[userId]+=amount;


    saveData(
      "points.json",
      points
    );

  }



  async function completeQuest(
    user,
    quest,
    index
  ){


    if(!quests.users[user.id]){

      quests.users[user.id]={
        completed:[]
      };

    }


    const data =
    quests.users[user.id];



    if(
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



    try{

      await user.send(
`🏆 השלמת משימה!

${quest.text}

💎 קיבלת ${quest.reward} נקודות`
      );

    }catch{}



    if(
      data.completed.length === 3
    ){


      addPoints(
        user.id,
        250
      );


      try{

        await user.send(
"👑 סיימת את כל המשימות!\n🎁 בונוס: +250 נקודות"
        );

      }catch{}

    }

  }




  // 💬 הודעות

  client.on(
    "messageCreate",
    async message=>{


      if(message.author.bot)
        return;



      const words =
      message.content
      .trim()
      .split(/\s+/);



      // לפחות 3 מילים

      if(words.length < 3)
        return;



      if(!chatCount[message.author.id])
        chatCount[message.author.id]=0;



      chatCount[message.author.id]++;



      quests.list?.forEach(
        async (quest,index)=>{


          if(
            quest.type==="chat" &&
            chatCount[message.author.id]
            >= quest.amount
          ){


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




  // 🎤 כניסה לוויס

  client.on(
    "voiceStateUpdate",
    (oldState,newState)=>{


      const member =
      newState.member ||
      oldState.member;



      if(!member || member.user.bot)
        return;



      if(newState.channel){

        voiceUsers[member.id]=true;

      }
      else{

        delete voiceUsers[member.id];

      }


    }
  );




  // כל דקה

  setInterval(
    async ()=>{


      quests =
      loadData(
        "quests.json",
        {}
      );



      for(
        const userId in voiceUsers
      ){


        if(!voiceUsers[userId])
          continue;



        const user =
        await client.users.fetch(userId)
        .catch(()=>null);



        if(!user)
          continue;



        if(!voiceUsers[userId].minutes)
          voiceUsers[userId].minutes=0;



        voiceUsers[userId].minutes++;



        quests.list?.forEach(
          async (quest,index)=>{


            if(
              quest.type==="voice" &&
              voiceUsers[userId].minutes
              >= quest.amount
            ){


              await completeQuest(
                user,
                quest,
                index
              );


            }


          }
        );


      }


    },
    60000
  );


};
