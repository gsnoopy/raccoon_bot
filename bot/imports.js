require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const { Client, GatewayIntentBits, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = Discord;

module.exports = {
  Discord,
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
};
