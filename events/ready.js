const client = require("../index");
const { Collection } = require("discord.js")
const config = require("../config.js")
const Discord = require("discord.js")
client.on("ready", () => {
console.log(`${client.user.tag} Bot Online!`)
let channel = config.channel
if (!channel) return console.log("Configi tam doldurmamışsın!")
let mesaj = config.content
if (!mesaj) return console.log("Configi tam doldurmamışsın!")
let name = config.button
if (!name) return console.log("Configi tam doldurmamışsın!")
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel(name)
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("tickets")
)
client.channels.cache.get(channel).send({content: `${mesaj}`, components: [row]})
});
