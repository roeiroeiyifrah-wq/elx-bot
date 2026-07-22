const { loadData, saveData } = require("../utils/save");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");


const POINTS_FILE = "points.json";


const WHEEL_CHANNEL_ID = "1529158985725251624";
const COST = 1000;


const LUCK_ROLE_ID = "1529150264022401165";
const SPECIAL_ROLE_ID = "1529155524028010637";


module.exports = (client) => {


  let points = loadData(
    POINTS_FILE,
    {}
  );


  function savePoints() {

    saveData(
      POINTS_FILE,
      points
    );

  }


  client.on(
    "interactionCreate",
    async interaction => {


      if (!interaction.isButton())
        return;


      if (interaction.customId !== "spin")
        return;



      const userId = interaction.user.id;


      if (!points[userId]) {
        points[userId] = 0;
      }



      if (points[userId] < COST) {

        const msg = await interaction.reply({
          content: "❌ אין לך מספיק נקודות",
          ephemeral: true,
          fetchReply: true
        });


        setTimeout(() => {
          interaction.deleteReply()
            .catch(()=>{});
        },5000);


        return;

      }



      points[userId] -= COST;



      const roll = Math.random() * 100;


      let result;



      if (roll < 1) {


        await interaction.member.roles.add(
          SPECIAL_ROLE_ID
        );


        result =
        "🎁 זכית ברול מיוחד!";


      }

      else if (roll < 6) {


        await interaction.member.roles.add(
          LUCK_ROLE_ID
        );


        result =
        "🎡 זכית ברול מזל!";


      }

      else if (roll < 14) {


        points[userId] += 1000;

        result =
        "💎 זכית ב־1000 נקודות";


      }

      else if (roll < 39) {


        points[userId] += 500;

        result =
        "💎 זכית ב־500 נקודות";


      }

      else if (roll < 64) {


        points[userId] += 100;

        result =
        "💎 זכית ב־100 נקודות";


      }

      else {


        result =
        "😭 לא זכית הפעם";


      }


      savePoints();



      const msg = await interaction.reply({
        content:
        `🎡 סובבת את הגלגל!\n\n${result}`,
        ephemeral:true,
        fetchReply:true
      });



      setTimeout(() => {

        interaction.deleteReply()
          .catch(()=>{});

      },5000);



    }

  );




  client.on(
    "ready",
    async () => {


      const channel =
      await client.channels.fetch(
        WHEEL_CHANNEL_ID
      ).catch(()=>null);



      if (!channel) return;



      const messages =
      await channel.messages.fetch({
        limit:10
      });



      const exists =
      messages.find(
        m => m.author.id === client.user.id
      );


      if (exists) return;



      const button =
      new ButtonBuilder()
      .setCustomId("spin")
      .setLabel("🎡 סובב גלגל")
      .setStyle(ButtonStyle.Primary);



      const row =
      new ActionRowBuilder()
      .addComponents(button);



      const embed =
      new EmbedBuilder()
      .setTitle("🎡 גלגל המזל")
      .setDescription(
        "לחץ על הכפתור כדי לסובב!\n💎 מחיר: 1000 נקודות"
      );



      channel.send({
        embeds:[embed],
        components:[row]
      });


    }
  );


};
