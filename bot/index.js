const { Discord, Client, GatewayIntentBits } = require('./imports');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.slashCommands = new Discord.Collection();
require('./handler')(client);

const { createTicket } = require('./modules/createModals/createTicket');
const { submitTicket } = require('./modules/submitModals/submitTicket');
const { deleteTicket } = require('./modules/pressButtons/deleteTicket');

const { buyUp } = require('./modules/pressButtons/buyUp');
const { deleteUp } = require('./modules/pressButtons/deleteUp');
const { verifyPasses } = require('./scripts/verifyPasses');

const { createDados } = require('./modules/createModals/createDados');
const { submitDados } = require('./modules/submitModals/submitDados');

const { buyBingo } = require('./modules/pressButtons/buyBingo');
const { deleteBingo } = require('./modules/pressButtons/deleteBingo');
const { verifyBingo } = require('./scripts/verifyBingo');

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(async () => {
    verifyPasses(client)
    verifyBingo(client)
  }, 5000);

});

client.on('interactionCreate', (interaction) => {

  if (interaction.type === Discord.InteractionType.ApplicationCommand) {

    const command = client.slashCommands.get(interaction.commandName);

    if (command) {
      command.run(client, interaction);
    }

  }

  if (interaction.isButton()) {

    switch (interaction.customId) {
      case 'ticket':
        createTicket(interaction);
        break;
      case 'deleteTicket':
        deleteTicket(interaction);
        break;
      case 'buyUp':
        buyUp(interaction);
        break;
      case 'deleteUp':
        deleteUp(interaction)
        break;
      case 'createDados':
        createDados(interaction)
        break;
      case 'buyBingo':
        buyBingo(interaction);
        break;
      case 'deleteBingo':
        deleteBingo(interaction);
        break;
      default:
    }
  }

  if (interaction.isModalSubmit()) {
    switch (interaction.customId) {

      case 'ticketModal':
        submitTicket(interaction);
        break;
      case 'modalDados':
        submitDados(interaction,client);
        break;
        
      default:
    }
  }

});

client.login(process.env.BOT_TOKEN);
module.exports = client;