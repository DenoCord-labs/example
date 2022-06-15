import { Client, SlashCommand, Embed } from "https://deno.land/x/denocordts/mod.ts";

const command = new SlashCommand()
  .setName("meme")
  .setDescription("Send a Meme in the Chat")

const bot = new Client({
  clientId: "", // client Id here
  token: "", // token of your bot here
  intents: ["Guilds", "GuildMembers"],
});


bot.on("Ready", async () => {
  console.log(`Logged in as ${bot.user.username}`);
  bot.updatePresence({
    activities: [{
      name: "DenoCord",
      type: "Watching",
      url: "https://meme-api.herokuapp.com/gimme/programmingmemes"
    }]
  })
  await bot.registerGlobalSlashCommands([command])
});

bot.on("CommandInteraction", async (interaction) => {
  if (interaction.isCommand) {
    const name = interaction.commandName
    if (command["name"] == name) {
      await interaction.deferReply()
      const memeData = await fetch("https://meme-api.herokuapp.com/gimme/programmingmemes").catch(() => {
        return void interaction.editReply({ content: "An Error Occured!" })
      })
      if (!memeData) return
      const meme = await memeData.json()
      const embed = new Embed().setColor("RANDOM").setAuthor({
        name: meme.author,
        icon_url: interaction.user?.avatarUrl || bot.displayAvatarUrl
      }).setImage(meme.url).setFooter({ text: `👍 ${meme.ups}` })
      await interaction.editReply({
        embeds: [embed]
      })
    }
  }
})
