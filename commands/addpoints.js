const {
  SlashCommandBuilder
} = require("discord.js");

const {
  loadData,
  saveData
} = require("../utils/save");


const STAFF_ROLE_ID =
"1524447926213017720";


module.exports = {

  data: new SlashCommandBuilder()

    .setName("addpoints")

    .setDescription("הוספת נקודות למשתמש")

    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("המשתמש")
        .setRequired(true)
    )

    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("כמות נקודות")
        .setRequired(true)
    ),



  async execute(interaction) {


    if (
      !interaction.member.roles.cache.has(
        STAFF_ROLE_ID
      )
    ) {

      return interaction.reply({

        content:
        "❌ אין לך הרשאה להשתמש בפקודה",

        ephemeral:true

      });

    }



    const user =
    interaction.options.getUser("user");


    const amount =
    interaction.options.getInteger("amount");



    const points =
    loadData(
      "points.json",
      {}
    );



    if (!points[user.id]) {

      points[user.id] = 0;

    }



    points[user.id] += amount;



    saveData(
      "points.json",
      points
    );



    const msg =
    await interaction.reply({

      content:
      `✅ נוספו ${amount} נקודות ל־${user}`,

      fetchReply:true

    });



    setTimeout(() => {

      msg.delete()
      .catch(()=>{});

    },2000);


  }

};
