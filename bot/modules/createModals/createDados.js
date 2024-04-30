const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('../../imports');

function createDados(interaction) {

    const modal = new ModalBuilder()
    .setCustomId('modalDados')
    .setTitle(`Dados para que realizemos o UP`);

    const loginInput = new TextInputBuilder()
        .setCustomId('loginInput')
        .setLabel("Login da sua conta")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

    const passwordInput = new TextInputBuilder()
        .setCustomId('passwordInput')
        .setLabel("Senha da sua conta")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)


    const questionInput = new TextInputBuilder()
        .setCustomId('questionInput')
        .setLabel("Possui autenticação de dois fatores?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

    const passeInput = new TextInputBuilder()
        .setCustomId('passeInput')
        .setLabel("Comprou o passe conosco?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

    const indicationInput = new TextInputBuilder()
        .setCustomId('indicationInput')
        .setLabel("Foi indicado por alguém?")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)

    const firstActionRow = new ActionRowBuilder().addComponents(loginInput);
    const secondActionRow = new ActionRowBuilder().addComponents(passwordInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(questionInput);
    const fourthActionRow = new ActionRowBuilder().addComponents(passeInput);
    const fifthActionrRow = new ActionRowBuilder().addComponents(indicationInput);

    modal.addComponents(firstActionRow);
    modal.addComponents(secondActionRow);
    modal.addComponents(thirdActionRow);
    modal.addComponents(fourthActionRow);
    modal.addComponents(fifthActionrRow);

    interaction.showModal(modal);
        
}
  
module.exports = { createDados };
  