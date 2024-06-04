const axios = require('axios');
const qrcode = require('qrcode');
const fs = require('fs');
const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Discord } = require('../../imports');
const path = require('path'); 
const { v4: uuidv4 } = require('uuid');

async function buyBingo(interaction) {

  await interaction.deferReply({ephemeral: true})

  try {

      const channelName = `🎈﹒bingo﹒${interaction.user.username}`;
      const category = interaction.guild.channels.cache.get(process.env.BINGO) ?? null;
      const existingChannel = interaction.guild.channels.cache.find(c => c.name === channelName);

      if (existingChannel) {

        return interaction.editReply({ 
          content: `Você já possui um ticket aberto sobre esse assunto em ${existingChannel}!`, 
          ephemeral: true 
        });

      }
    
      const channel = await interaction.guild.channels.create({

        name: channelName,
        type: Discord.ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [
              Discord.PermissionFlagsBits.ViewChannel
            ]
          },
          {
            id: interaction.user.id,
            allow: [
              Discord.PermissionFlagsBits.ViewChannel,
              Discord.PermissionFlagsBits.SendMessages,
              Discord.PermissionFlagsBits.AttachFiles,
              Discord.PermissionFlagsBits.EmbedLinks,
              Discord.PermissionFlagsBits.AddReactions
            ]
          }
        ]

      });
      
      interaction.editReply({ 
        content: `Aguarde estamos criando seu pagamento!`, 
        ephemeral: true 
      });

      const userId = interaction.user.id;

      const channelId = channel.id;

      const transactionAmount = 5.00;
      const description = `Bingo entre amigos - ${interaction.user.username}`;
      const buyerEmail = `buyer@gmail.com`;
      const buyerCPF = '47161952441';
      const accessToken = process.env.MP_CICO;
      const apiUrl = 'https://api.mercadopago.com/v1/payments';

      const paymentData = {
        transaction_amount: transactionAmount,
        description: description,
        payment_method_id: 'pix',
        payer: {
          email: buyerEmail,
          identification: {
            type: 'CPF',
            number: buyerCPF
          },
          //first_name: buyerName
        }
      };

      const idempotencyKey = uuidv4()

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Idempotency-Key': idempotencyKey
      };

      const response = await axios.post(apiUrl, paymentData, { headers });

      const paymentID = response.data.id;
      const pixKey = response.data.point_of_interaction.transaction_data.qr_code;
      const ticketUrl = response.data.point_of_interaction.transaction_data.ticket_url;

      async function generateQRCode(pixKey) {

        try {

          const qrCodeDataUrl = await qrcode.toDataURL(pixKey);
          const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
          const qrCodeBuffer = Buffer.from(base64Data, 'base64');

          fs.writeFileSync('./temp/qrcode.png', qrCodeBuffer);

        } catch (err) {

          console.error('Erro ao gerar o QR code:', err);

        }
      }

      await generateQRCode(pixKey);

      const file = new AttachmentBuilder('./temp/qrcode.png');

      const embed = new EmbedBuilder()
        .setColor(0x030303)
        .setTitle(`ID: ${paymentID}`)
        .setDescription(`Valor de cinco cartelas: ** R$ ${transactionAmount} **\nRealize o pagamento através do QR Code para continuar, caso esteja no celular, clique no botão abaixo para ser direcionado ao Mercado Pago`)
        .setThumbnail('attachment://qrcode.png');

      const buttons = new ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setLabel('PIX Ticket')
          .setURL(`${ticketUrl}`)
          .setStyle(ButtonStyle.Link),
        new Discord.ButtonBuilder()
          .setCustomId("deleteBingo")
          .setLabel("Cancelar compra")
          .setEmoji("<:lockWhite:1234743193409552414>") 
          .setStyle(Discord.ButtonStyle.Danger),
      );

      channel.send({ embeds: [embed], components: [buttons], files: [file] })

      await interaction.editReply({ 
        content: `Seu ticket para comprar cartelas de bingo foi aberto no canal: ${channel}!`, 
        ephemeral: true 
      });

      const novoRegistro = {
        userId: userId,
        username: interaction.user.username,
        valor: transactionAmount,
        channelId: channelId,
        paymentId: paymentID,
        createdAt: new Date().toISOString(), // Registrando a data atual
        ticketUrl: ticketUrl
      };

      const filePath = path.join(__dirname, '../../database/Bingo/pagAtivos.json');

      let jsonContent = [];
      try {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        jsonContent = JSON.parse(jsonData);
      } catch (error) {
        console.error('Erro ao ler o arquivo JSON:', error);
      }
  
      jsonContent.push(novoRegistro);
  
      try {
        const jsonData = JSON.stringify(jsonContent, null, 2);
        fs.writeFileSync(filePath, jsonData);
        console.log('Dados registrados com sucesso no arquivo JSON.');
      } catch (error) {
        console.error('Erro ao escrever no arquivo JSON:', error);
      }

  } catch (error) {

    console.error('Erro ao processar transação: buyBingo', error);

  }
}

module.exports = { buyBingo };
