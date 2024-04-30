const { Discord } = require('../../imports');
const { createLogs } = require('../../logs/createLogs')

async function submitDados(interaction,client) {

  await interaction.deferReply({ephemeral: true})
  const channel = interaction.channel

  try {

      const loginInput = interaction.fields.getTextInputValue('loginInput');
      const passwordInput = interaction.fields.getTextInputValue('passwordInput');
      const question = interaction.fields.getTextInputValue('questionInput');
      const passeInput = interaction.fields.getTextInputValue('passeInput');
      const indicationInput = interaction.fields.getTextInputValue('indicationInput');

      const userAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });

          
      const embed = new Discord.EmbedBuilder()
        .setTitle(`Obrigado ${interaction.user.username}`)
        .setThumbnail(userAvatar)
        .setColor(0xD904FF)
        .setDescription(`Seus dados foram enviados e iremos começar o UP do seu passe, por favor não logue na conta até que avisemos que o serviço foi realizado de acordo com os termos [EDITAR]`)
        .setTimestamp()

        const button = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
              .setCustomId("doneService")
              .setLabel("Serviço Finalizado")
              .setStyle(Discord.ButtonStyle.Primary)
        );

        let embedLog = new Discord.EmbedBuilder()
            .setColor(0xD904FF)
            .setTitle("Passe para upar")
            .setThumbnail(userAvatar)
            .setDescription(`**Login:** ${loginInput}\n**Password:** ${passwordInput}\n**Two Factor:** ${question}\n**Cliente:** ${interaction.user.username}\n**Indicação:** ${indicationInput}\n**Comprou conosco:** ${passeInput}`)

      await createLogs(client,'1234602883169783849', embedLog)

      if (channel) {
          const messages = await channel.messages.fetch({ limit: 100 });
          await channel.bulkDelete(messages);
        }

      await channel.send(({ embeds: [embed], components: [button]}));
      interaction.editReply({ content: `Dados enviados!`, ephemeral: true });


  } catch (error) {

    console.error('Erro ao enviar dados:', error);
    interaction.editReply({ content: "Erro ao enviar dados", ephemeral: true });
    
  }
}

module.exports = { submitDados };
