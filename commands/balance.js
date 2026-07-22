const { SlashCommandBuilder } = require("discord.js");
const { loadData } = require("../utils/save");

const STAFF_ROLE_ID = "1524447926213017720";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("בדיקת כמות נקודות")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("בדיקת נקודות של משתמש (לצוות בלבד)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const points = loadData("points.json", {});

    const target = interaction.options.getUser("user");

    // אם בחרו משתמש אחר
    if (target) {
      if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
        return interaction.reply({
          content: "❌ רק צוות יכול לבדוק נקודות של משתמש אחר.",
          ephemeral: true
        });
      }

      const amount = points[target.id] || 0;

      return interaction.reply({
        content: `💎 ל-${target.username} יש ${amount} נקודות`,
        ephemeral: true,
        allowedMentions: { users: [] }
      });
    }

    // בדיקת עצמך
    const amount = points[interaction.user.id] || 0;

    return interaction.reply({
      content: `💎 יש לך ${amount} נקודות`,
      ephemeral: true
    });
  }
};
