const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('../../imports');

function createSkins(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('skinModal')
            .setTitle(`Escolha de Skin`);
  
        const questionInput = new TextInputBuilder()
            .setCustomId('skinInput')
            .setLabel("Digite o nome da Skin:")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow = new ActionRowBuilder().addComponents(questionInput);

        modal.addComponents(firstActionRow);

        interaction.showModal(modal);
        
}
  
module.exports = { createSkins };
  