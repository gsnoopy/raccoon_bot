const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('../../imports');

function createSaldo(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('saldoModal')
            .setTitle(`Prêmio do Jogo do Bicho`);
  
        const questionInput = new TextInputBuilder()
            .setCustomId('userSiteInput')
            .setLabel("Digite o seu user do site presenteslol:")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow = new ActionRowBuilder().addComponents(questionInput);

        modal.addComponents(firstActionRow);

        interaction.showModal(modal);
        
}
  
module.exports = { createSaldo };
  