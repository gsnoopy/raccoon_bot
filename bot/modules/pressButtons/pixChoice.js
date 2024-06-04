const Discord = require("discord.js");  
const { LocalStorage } = require('node-localstorage');

async function pixChoice(interaction) {

    await interaction.deferReply({ ephemeral: true });

        try {

            const localStorage = new LocalStorage('../database/temp');
            const premio = localStorage.getItem('valorGanho');


            const buttons = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                  .setCustomId("saldoChoice")
                  .setLabel("Saldo no site")
                  .setEmoji("<:moneybagWhite:1234743197482221589>")
                  .setStyle(Discord.ButtonStyle.Primary)
                  .setDisabled(true),
              new Discord.ButtonBuilder()
                  .setCustomId("pixChoice")
                  .setLabel("Pix em sua conta")
                  .setEmoji("<:cicopix:1247437162698379295>")
                  .setStyle(Discord.ButtonStyle.Primary)
                  .setDisabled(true),
            );

            await interaction.message.edit({ components: [buttons] });

            await interaction.channel.send(`Você escolheu a opção PIX, digite sua chave e aguarde um <@&1230464400259809333> fazer a transferência de **R$ ${premio}** para você`)
            await interaction.editReply({content: "Solicitação realizada", ephemeral: true })


        } catch (error) {
        
            console.error('Erro ao processar botão "pixChoice":', error);
            await interaction.editReply({ content: "Erro ao processar o botão pixChoice.", ephemeral: true });
        
        }
    
}

module.exports = { pixChoice };
