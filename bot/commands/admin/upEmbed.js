const Discord = require("discord.js")

module.exports = {
  name: "passes",
  description: "[ADM] Embed para compra de UP automático de passes",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client,interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {

      interaction.reply({ content: `Você não possui permissão para utilzar este comando!`, ephemeral: true });

    } else {

      let embed = new Discord.EmbedBuilder()
      .setColor(0x8000FF)
        .setTitle("Up automático de Passe")
        .setDescription("Uparemos o seu passe automaticamente do nível 1 ao 50 pelo valor de **R$ 20,00** garantindo máxima segurança com zero riscos de banimento, clique no botão abaixo e realize sua compra!")
        .setImage("https://media.discordapp.net/attachments/1230485567750537246/1234753450680782909/uPasse.png?ex=6631e143&is=66308fc3&hm=837de073d65574c85eb5892b7e100a82a50dcd8c44cec448b80961fa3acfae2e&=&format=webp&quality=lossless&width=789&height=279")
        
      const button = new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("buyUp")
            .setLabel("Comprar serviço")
            .setEmoji("<:cart:1234743189290618943>")
            .setStyle(Discord.ButtonStyle.Primary)
      );

      interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true });
      interaction.channel.send({ embeds: [embed], components: [button] });
    }
  }
}