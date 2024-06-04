const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('../../imports');

function createChampions(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('championModal')
            .setTitle(`Pesquisa de Skins`);
  
        const questionInput = new TextInputBuilder()
            .setCustomId('championInput')
            .setLabel("Digite o nome do campeão")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow = new ActionRowBuilder().addComponents(questionInput);

        modal.addComponents(firstActionRow);

        interaction.showModal(modal);
        
}
  
module.exports = { createChampions };
  