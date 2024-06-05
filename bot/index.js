const { Discord, Client, GatewayIntentBits } = require('./imports');
const fs = require('fs');
const cron = require('node-cron');

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

// Map para armazenar os preços por interação
const interactionPrices = new Map();

const { createTicket } = require('./modules/createModals/createTicket');
const { submitTicket } = require('./modules/submitModals/submitTicket');
const { deleteTicket } = require('./modules/pressButtons/deleteTicket');
const { ticketReward } = require('./modules/pressButtons/ticketReward');

const { buyUp } = require('./modules/pressButtons/buyUp');
const { deleteUp } = require('./modules/pressButtons/deleteUp');
const { verifyPasses } = require('./scripts/verifyPasses');

const { createDados } = require('./modules/createModals/createDados');
const { submitDados } = require('./modules/submitModals/submitDados');

const { buyBingo } = require('./modules/pressButtons/buyBingo');
const { deleteBingo } = require('./modules/pressButtons/deleteBingo');
const { verifyBingo } = require('./scripts/verifyBingo');

const { buyRandom } = require('./modules/pressButtons/buyRandom');
const { deleteRandom } = require('./modules/pressButtons/deleteRandom');
const { verifyRandom } = require('./scripts/verifyRandom');

const { createChampions } = require('./modules/createModals/createChampions');
const { submitChampions } = require('./modules/submitModals/submitChampions');

const { createSkins } = require('./modules/createModals/createSkins');
const { submitSkin } = require('./modules/submitModals/submitSkin');
const { deleteSkins } = require('./modules/pressButtons/deleteSkins');
const { verifySkin } = require('./scripts/verifySkin');

const { serviceDone } = require('./modules/pressButtons/serviceDone');
const { selectBicho } = require('./modules/selectMenu/selectBicho');
const { verifyBicho } = require('./scripts/verifyBicho');
const { sorteioBicho } = require('./scripts/sorteioBicho');
const { createSaldo } = require('./modules/createModals/createSaldo');
const { submitUserSite } = require('./modules/submitModals/submitUserSite');
const { pixChoice } = require('./modules/pressButtons/pixChoice');


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(async () => {
    verifyPasses(client)
    verifyBingo(client)
    verifyRandom(client)
    verifySkin(client)
    verifyBicho(client)
  }, 5000);

  cron.schedule('41 18 * * *', () => {
    sorteioBicho(client);
  }, {
    scheduled: true,
    timezone: "America/Sao_Paulo" // Ajuste para o seu fuso horário
  });
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
        deleteUp(interaction);
        break;
      case 'createDados':
        createDados(interaction);
        break;
      case 'buyBingo':
        buyBingo(interaction);
        break;
      case 'deleteBingo':
        deleteBingo(interaction);
        break;
      case 'ticketReward':
        ticketReward(interaction);
        break;
      case 'buyRandom':
        buyRandom(interaction);
        break;
      case 'deleteRandom':
        deleteRandom(interaction);
        break;
      case 'searchSkins':
        createChampions(interaction);
        break;
      case 'deleteSkins':
        deleteSkins(interaction);
        break;
      case 'serviceDone':
        serviceDone(interaction);
        break;
      case 'saldoChoice':
        createSaldo(interaction);
        break;
      case 'pixChoice':
        pixChoice(interaction)
        break;
      default:
    }
  }

  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'skinChoice') {
      const selectedValue = interaction.values[0];
      let price;

      switch (selectedValue) {
        case 'default':
          price = 27.00;
          break;
        case 'epic':
          price = 30.00;
          break;
        case 'legendary':
          price = 35.00;
          break;
        case 'ultimate':
          price = 40.00;
          break;
        default:
      }
      // Armazena o preço no Map usando a interação ID como chave
      interactionPrices.set(interaction.user.id, price);
      createSkins(interaction, price);
    }

    if(interaction.customId === "bichoChoice"){
      const bicho = interaction.values[0];
      selectBicho(interaction, bicho);
    }
  }

  if (interaction.isModalSubmit()) {
    switch (interaction.customId) {
      case 'ticketModal':
        submitTicket(interaction);
        break;
      case 'modalDados':
        submitDados(interaction, client);
        break;
      case 'championModal':
        submitChampions(interaction);
        break
      case 'skinModal':
        const price = interactionPrices.get(interaction.user.id);
        submitSkin(interaction, price);
        break;
      case 'saldoModal':
        submitUserSite(interaction)
      default:
    }
  }

});

client.login(process.env.TOKEN_TESTE);
module.exports = client;
