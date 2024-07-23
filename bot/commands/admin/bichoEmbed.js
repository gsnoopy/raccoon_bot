const Discord = require("discord.js")
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
  name: "bicho",
  description: "[ADM] Embed para o Jogo do Bicho",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client,interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {

      interaction.reply({ content: `Você não possui permissão para utilzar este comando!`, ephemeral: true });

    } else {

      let embed = new Discord.EmbedBuilder()
        .setColor(0x8000FF)
        .setTitle("Jogo do Bicho!")
        .setDescription("Tenha a oportunidade de ganhar saldo no site PresentesLOL ou receber via Pix direto na sua conta!\n\n**Como Funciona?**\n\n- Escolha um bicho para apostar\n- Efetue o pagamento da aposta\n- Aguarde o sorteio do bicho\n\n**Como Acontecem os Sorteios?**\n\n- Todos os dias às 21h. Caso o número mínimo de apostas não seja atingido, o sorteio será adiado para o dia seguinte.\n- Um dos animais comprados é sorteado, seguido pelo sorteio de um usuário que comprou esse animal específico. Animais não comprados não participam do sorteio\n\n**Prêmio Acumulado:**\n\nR$ 7,00")
        .setThumbnail('https://cdn-store.leagueoflegends.co.kr/images/v2/emotes/1516.png')
        
        const select = new StringSelectMenuBuilder()
            .setCustomId('bichoChoice')
            .setPlaceholder('Escolha o Bicho que deseja jogar!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Barata')
                    .setEmoji('<:khazixcico:1246717078627422228>')
                    .setDescription('R$ 01,00')
                    .setValue('Barata'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Bambi')
                    .setEmoji('<:lilliacico:1246716957080817764>')
                    .setDescription('R$ 01,00')
                    .setValue('Bambi'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Bode')
                    .setEmoji('<:ornncico:1246716877925908532>')
                    .setDescription('R$ 01,00')
                    .setValue('Bode'),    
                new StringSelectMenuOptionBuilder()
                    .setLabel('Cachorro')
                    .setEmoji('<:nasuscico:1246716919525015614>')
                    .setDescription('R$ 01,00')
                    .setValue('Cachorro'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Cavalo')
                    .setEmoji('<:hecarimcico:1246717114576797726>')
                    .setDescription('R$ 01,00')
                    .setValue('Cavalo'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Cobra')
                    .setEmoji('<:cassiopeiacico:1246717221275832321>')
                    .setDescription('R$ 01,00')
                    .setValue('Cobra'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Dragão')
                    .setEmoji('<:smoldercico:1246716685231329331>')
                    .setDescription('R$ 01,00')
                    .setValue('Dragão'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Elefante')
                    .setEmoji('<:gragascico:1246717149888643112>')
                    .setDescription('R$ 01,00')
                    .setValue('Elefante'),    
                new StringSelectMenuOptionBuilder()
                    .setLabel('Escorpião')
                    .setEmoji('<:skarcico:1246716724670365778>')
                    .setDescription('R$ 01,00')
                    .setValue('Escorpião'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Gato')
                    .setEmoji('<:yuumicico:1246716453189586945>')
                    .setDescription('R$ 01,00')
                    .setValue('Gato'),
                    new StringSelectMenuOptionBuilder()
                    .setLabel('Guaxinim')
                    .setEmoji('<:teemocico:1246716619552587886>')
                    .setDescription('R$ 01,00')
                    .setValue('Guaxinim'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Jacaré')
                    .setEmoji('<:renektoncico:1246716802768310382>')
                    .setDescription('R$ 01,00')
                    .setValue('Jacaré'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Leão')
                    .setEmoji('<:rengarcico:1246716763547107338>')
                    .setDescription('R$ 01,00')
                    .setValue('Leão'),    
                new StringSelectMenuOptionBuilder()
                    .setLabel('Lobo')
                    .setEmoji('<:warwickcico:1246716517777936467>')
                    .setDescription('R$ 01,00')
                    .setValue('Lobo'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Macaco')
                    .setEmoji('<:wukongcico:1246716488497365002>')
                    .setDescription('R$ 01,00')
                    .setValue('Macaco'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Ovelha')
                    .setEmoji('<:kindredcico:1246717006024151152>')
                    .setDescription('R$ 01,00')
                    .setValue('Ovelha'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Passarinho')
                    .setEmoji('<:aniviacico:1246717284509290567>')
                    .setDescription('R$ 01,00')
                    .setValue('Passarinho'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Peixe')
                    .setEmoji('<:fizzcico:1246717189730336789>')
                    .setDescription('R$ 01,00')
                    .setValue('Peixe'),    
                new StringSelectMenuOptionBuilder()
                    .setLabel('Pombo')
                    .setEmoji('<:azircico:1246717250564788234>')
                    .setDescription('R$ 01,00')
                    .setValue('Pombo'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Raposa')
                    .setEmoji('<:ahricico:1246717319091064874>')
                    .setDescription('R$ 01,00')
                    .setValue('Raposa'),
                    new StringSelectMenuOptionBuilder()
                    .setLabel('Rato')
                    .setEmoji('<:twitchcico:1246716587353047141>')
                    .setDescription('R$ 01,00')
                    .setValue('Rato'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Sapo')
                    .setEmoji('<:tkcico:1246716651970494504>')
                    .setDescription('R$ 01,00')
                    .setValue('Sapo'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Tatu')
                    .setEmoji('<:rammuscico:1246716844442783877>')
                    .setDescription('R$ 01,00')
                    .setValue('Tatu'),    
                new StringSelectMenuOptionBuilder()
                    .setLabel('Urso')
                    .setEmoji('<:volibearcico:1246716552309379083>')
                    .setDescription('R$ 01,00')
                    .setValue('Urso'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Vaca')
                    .setEmoji('<:alistarcico:1246713250842673245>')
                    .setDescription('R$ 01,00')
                    .setValue('Vaca'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

      interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true });
      interaction.channel.send({ embeds: [embed], components: [row] });
    }
  }
}