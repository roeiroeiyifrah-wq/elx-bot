const {
  SlashCommandBuilder
} = require("discord.js");


const STAFF_ROLE_ID =
"1524447926213017720";


module.exports = {

  data: new SlashCommandBuilder()

    .setName("clear")

    .setDescription("מחיקת כל ההודעות בחדר"),



  async execute(interaction) {


    if (
      !interaction.member.roles.cache.has(
        STAFF_ROLE_ID
      )
    ) {

      return interaction.reply({

        content:
        "❌ אין לך הרשאה להשתמש בפקודה הזאת",

        ephemeral: true

      });

    }



    await interaction.reply({

      content:
      "🧹 מנקה את החדר...",

      ephemeral: true

    });



    const channel =
      interaction.channel;



    const messages =
      await channel.messages.fetch({
        limit: 100
      });



    await channel.bulkDelete(
      messages,
      true
    );



    const msg =
      await channel.send(
        "🧹 החדר נוקה בהצלחה"
      );



    setTimeout(() => {

      msg.delete()
      .catch(() => {});

    }, 5000);


  }

};
