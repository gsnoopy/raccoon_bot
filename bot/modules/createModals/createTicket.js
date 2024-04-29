const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('../../imports');

function createTicket(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('ticketModal')
            .setTitle(`Formulario para Suporte`);
  
        const questionInput = new TextInputBuilder()
            .setCustomId('questionInput')
            .setLabel("Digite sua dúvida ou problema")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(200)
            .setMinLength(20);

        const firstActionRow = new ActionRowBuilder().addComponents(questionInput);

        modal.addComponents(firstActionRow);

        interaction.showModal(modal);
        
}
  
module.exports = { createTicket };
  