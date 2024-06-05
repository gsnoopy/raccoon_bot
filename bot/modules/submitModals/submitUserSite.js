const { Discord } = require('../../imports');
const { LocalStorage } = require('node-localstorage');
const axios = require('axios');

async function submitUserSite(interaction) {

    await interaction.deferReply()

  try {

    const userSite = interaction.fields.getTextInputValue('userSiteInput');
    const localStorage = new LocalStorage('./temp');
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
    

    const url = `https://presenteslol.com/adm/apibixo.php?cicoapikey=${process.env.CICOKEY}&user=${userSite}&valor=${premio}`
    console.log(url)
    
    try {
        const response = await axios.get(url);
        await interaction.editReply({ 
            content: `${response.data}!`, 
        });
    } catch (error) {
        await interaction.editReply({ 
            content: `${error}!`, 
        });
    }
    
  } catch (error) {

    console.error('Erro ao enviar dados:', error);
    interaction.editReply({ content: "Erro ao enviar saldo"});
    
  }
}

module.exports = { submitUserSite };
