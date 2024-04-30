const Discord = require("discord.js")

module.exports = {
  name: "bingo",
  description: "[ADM] Embed para compra de Bingo Automático",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client,interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {

      interaction.reply({ content: `Você não possui permissão para utilzar este comando!`, ephemeral: true });

    } else {

      let embed = new Discord.EmbedBuilder()
        .setTitle("Bingão do Cico!")
        .setDescription("**Participe do nosso bingo e ganhe prêmios incríveis! **\n\n🎁 Você tem a chance de ganhar:\n\n**1° Prêmio: 490 RP** \n**2° Prêmio: 790 RP**\n**3° Prêmio: 1350 RP** \n**4° Prêmio: Passe** \n**5° Prêmio: Passe Premium** \n\n📅 **O Bingo será no sábado dia 4 às 18 horas**\n\n🔥 Não perca tempo!\nAdquira sua cartela agora mesmo e entre na corrida pelos prêmios mais cobiçados do momento! \n\n**Clique no botão abaixo e garanta sua participação.**\n\nA sorte está ao seu lado! 🍀✨")
        .setColor(0xD904F)
        .setThumbnail('https://i.imgur.com/127oiJ5.png')
        
      const button = new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("buyBingo")
            .setLabel("Comprar Cartela")
            .setEmoji("<:cart:1234743189290618943>")
            .setStyle(Discord.ButtonStyle.Primary)
      );

      interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true });
      interaction.channel.send({ embeds: [embed], components: [button] });
    }
  }
}