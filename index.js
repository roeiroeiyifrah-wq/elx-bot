const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes
} = require("discord.js");

const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});


const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;


// טעינת פקודות
client.commands = new Collection();


const commandFiles = fs.readdirSync("./commands");


for (const file of commandFiles) {

  const command = require(`./commands/${file}`);

  client.commands.set(
    command.data.name,
    command
  );

}


// טעינת מערכות

require("./systems/wheelSystem")(client);
require("./systems/questSystem")(client);
require("./systems/activitySystem")(client);



client.once("ready", async () => {

  console.log(
    `✅ מחובר בתור ${client.user.tag}`
  );


  const rest = new REST({
    version: "10"
  }).setToken(TOKEN);



  await rest.put(
    Routes.applicationGuildCommands(
      client.user.id,
      GUILD_ID
    ),
    {
      body: client.commands.map(
        command => command.data.toJSON()
      )
    }
  );


  console.log("✅ הפקודות נטענו");

});



client.on(
  "interactionCreate",
  async interaction => {


    if (!interaction.isChatInputCommand())
      return;


    const command =
      client.commands.get(
        interaction.commandName
      );


    if (!command) return;


    try {

      await command.execute(
        interaction
      );

    } catch(error) {

      console.log(error);

      if (!interaction.replied) {

        interaction.reply({
          content: "❌ הייתה שגיאה",
          ephemeral: true
        });

      }

    }


  }
);



client.login(TOKEN);
