const Discord = require("discord.js")

module.exports = {
  name: "smurfs",
  description: "[ADM] Embed para compra de Smurfs",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client,interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {

      interaction.reply({ content: `Você não possui permissão para utilzar este comando!`, ephemeral: true });

    } else {

      let embed = new Discord.EmbedBuilder()
      .setColor(0x8000FF)
        .setTitle("Smurfs Unranked")
        .setDescription("Compre sua smurf com MMR zerado pronta para partidas ranqueadas com 100% de segurança contra banimentos e 30 dias de garantia!")
        .setImage("https://media.discordapp.net/attachments/1230485567750537246/1245258089612181564/AWK_CHAT_BANNER.gif?ex=66581878&is=6656c6f8&hm=0a6561baf484437da7befd79586077648022a9dd27505093c576e736b3f52397&=&width=525&height=350")
        
      const buttons = new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("buyRandom")
            .setLabel("Comprar Random - R$ 25.00")
            .setEmoji("<:cartWhite:1234743199256281128>")
            .setStyle(Discord.ButtonStyle.Primary),
         new Discord.ButtonBuilder()
            .setCustomId("searchSkins")
            .setLabel("Pesquisar Skins")
            .setEmoji("<:dataWhite:1234743192000266250>")
            .setStyle(Discord.ButtonStyle.Primary)
      );

      interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true });
      interaction.channel.send({ embeds: [embed], components: [buttons] });
    }
  }
}