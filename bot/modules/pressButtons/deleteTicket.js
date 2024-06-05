const Discord = require("discord.js");  

const { transcriptMessages } = require('../../logs/transcriptMessages')

async function deleteTicket(interaction) {

    await interaction.deferReply({ ephemeral: true });

        try {

            const channel = interaction.channel;

            const button = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                  .setCustomId("deleteTicket")
                  .setLabel("Fechar canal")
                  .setEmoji("<:deleteAd:1199292226988154880>") 
                  .setStyle(Discord.ButtonStyle.Primary)
                  .setDisabled(true),
              );
              
                await interaction.message.edit({ components: [button] });
                interaction.editReply({content: "O canal será fechado em 3 segundos!"});
                await transcriptMessages(interaction,channel,'1234748679261519893');
                    
        
            } catch (error) {
            
                console.error('Erro ao processar botão "deleteTicket":', error);
                await interaction.reply({ content: "Erro ao processar o botão deleteTicket.", ephemeral: true });
            
            }
    
}

module.exports = { deleteTicket };
