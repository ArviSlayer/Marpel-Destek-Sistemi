const { Client, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config.js");
const Discord = require("discord.js")
const db = require("croxydb")
const client = new Client({
  partials: [
    Partials.Message, // for message
    Partials.Channel, // for text channel
    Partials.GuildMember, // for guild member
    Partials.Reaction, // for message reaction
    Partials.GuildScheduledEvent, // for guild events
    Partials.User, // for discord user
    Partials.ThreadMember, // for thread member
  ],
  intents: [
    GatewayIntentBits.Guilds, // for guild related things
    GatewayIntentBits.GuildMembers, // for guild members related things
    GatewayIntentBits.GuildBans, // for manage guild bans
    GatewayIntentBits.GuildEmojisAndStickers, // for manage emojis and stickers
    GatewayIntentBits.GuildIntegrations, // for discord Integrations
    GatewayIntentBits.GuildWebhooks, // for discord webhooks
    GatewayIntentBits.GuildInvites, // for guild invite managing
    GatewayIntentBits.GuildVoiceStates, // for voice related things
    GatewayIntentBits.GuildPresences, // for user presence things
    GatewayIntentBits.GuildMessages, // for guild messages things
    GatewayIntentBits.GuildMessageReactions, // for message reactions things
    GatewayIntentBits.GuildMessageTyping, // for message typing things
    GatewayIntentBits.DirectMessages, // for dm messages
    GatewayIntentBits.DirectMessageReactions, // for dm message reaction
    GatewayIntentBits.DirectMessageTyping, // for dm message typinh
    GatewayIntentBits.MessageContent, // enable if you need message content things
  ],
});

module.exports = client;

require("./events/message.js")
require("./events/ready.js")

client.login(config.token || process.env.TOKEN)
client.on('messageCreate', async message => {
let kanal = db.fetch(`ticket_${message.channel.id}`)
if (!kanal) return;
db.add(`mesaj_${message.channel.id}`, 1)

})
client.on('interactionCreate', async interaction => {
          if (!interaction.isButton()) return;
          if(interaction.customId === "tickets") {
            interaction.guild.channels.create({
            name: `talep-${interaction.user.username}`,
              type: Discord.ChannelType.GuildText,

              permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.yetkili,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                }
            ]
          })


                .then((channel2)=>{
const embed = new Discord.EmbedBuilder()
.setDescription("Başarıyla destek talebi oluşturdun. <#"+channel2.id+">")
.setColor("Red")
interaction.reply({embeds: [embed], ephemeral: true})
const embed2 = new Discord.EmbedBuilder()
.setAuthor({name: "Yeni bir destek talebi", iconURL: interaction.guild.iconURL({dynamic: true})})
.addFields({ name: 'Talep Açan:', value: `${interaction.user}`, inline: true})
.addFields({ name: 'Talep Açılış Tarihi:', value: `<t:${Math.floor(Date.now() /1000)}:R>`, inline: true})
.setFooter({text: `Talep Açan: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({dynamic: true})})
.setColor("Green")
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel("Talebi Kapat")
.setStyle(Discord.ButtonStyle.Success)
.setCustomId("kapat")
.setEmoji("❌"),
new Discord.ButtonBuilder()
.setLabel("Sesli Destek Oluştur")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("olustur")
.setEmoji("<:Voice_Virtual:1028018710432186368>")
)
db.set(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag})
channel2.send({embeds: [embed2], components: [row]})
channel2.send({content: "<@"+interaction.user+">  Sesli destek için yukarıdaki 🎧 butonuna basın\nSorun çözüldüğünde talebi kapatmak için :x: butonuna basın.\nTalep komutlarını görmek için: **!komutlar**\n\n@everyone @here"})
})
        }
        if(interaction.customId === "kapat") {
let log = config.log
let channel = interaction.channel
if (!log) return;
let ticket = db.fetch(`ticket_${channel.id}`)
let kullanici = ticket.sahip
let zaman = ticket.date
let date = `<t:${Math.floor(zaman /1000)}:R>`
let mesaj = db.fetch(`mesaj_${channel.id}`) || "0"
const embed = new Discord.EmbedBuilder()
.setAuthor({name: interaction.user.tag+" Kişisinin kapattığı talebin verileri.", iconURL:  interaction.user.avatarURL({dynamic: true})})
.addFields({name: "Talep Açan:", value: "<@"+kullanici+">", inline: true})
.addFields({name: "Talep Açılış Tarihi:", value: date, inline: true})
.setColor("Green")
.setFooter({text: "Talebe Yazılan Mesaj Sayısı: ("+mesaj+")"})
client.channels.cache.get(log).send({embeds: [embed]})
channel.delete()

}
if(interaction.customId === "olustur") {
let channel = interaction.channel
let ticket = db.fetch(`ticket_${channel.id}`)
let usır = ticket.sahip
let zaman = ticket.date
let tag = ticket.tag
let date = `<t:${Math.floor(zaman /1000)}:R>`
let avatar = client.users.cache.get(usır)
const embed = new Discord.EmbedBuilder()
.setAuthor({name: "Yeni bir destek talebi", iconURL: interaction.guild.iconURL({dynamic: true})})
.addFields({ name: 'Talep Açan:', value: `<@${usır}>`, inline: true})
.addFields({ name: 'Talep Açılış Tarihi:', value: date, inline: true})
.setFooter({text: `Talep Açan: ${tag}`, iconURL: avatar.displayAvatarURL({})})
.setColor("Green")
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel("Talebi Kapat")
.setStyle(Discord.ButtonStyle.Success)
.setCustomId("kapat")
.setEmoji("❌"),
new Discord.ButtonBuilder()
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("olusturma")
.setEmoji("🔇")

)
let ad = interaction.channel.name
let id = interaction.channel.id
interaction.guild.channels.create({name: ad, type: Discord.ChannelType.GuildVoice}).then((sesli) => {
interaction.update({embeds: [embed], components: [row]})
db.set(`sesli_${id}`, sesli.id)
})
}
if(interaction.customId === "olusturma") {
  let id = interaction.channel.id
let sesli = db.fetch(`sesli_${id}`)
interaction.guild.channels.delete(sesli)
let channel = interaction.channel
let ticket = db.fetch(`ticket_${channel.id}`)
let usır = ticket.sahip
let zaman = ticket.date
let tag = ticket.tag
let date = `<t:${Math.floor(zaman /1000)}:R>`
let avatar = client.users.cache.get(usır)
const embed = new Discord.EmbedBuilder()
.setAuthor({name: "Yeni bir destek talebi", iconURL: interaction.guild.iconURL({dynamic: true})})
.addFields({ name: 'Talep Açan:', value: `<@${usır}>`, inline: true})
.addFields({ name: 'Talep Açılış Tarihi:', value: date, inline: true})
.setFooter({text: `Talep Açan: ${tag}`, iconURL: avatar.displayAvatarURL({})})
.setColor("Green")
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel("Talebi Kapat")
.setStyle(Discord.ButtonStyle.Success)
.setCustomId("kapat")
.setEmoji("❌"),
new Discord.ButtonBuilder()
.setLabel("Sesli Destek Oluştur")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("olustur")
.setEmoji("<:Voice_Virtual:1028018710432186368>")
)
interaction.update({embeds: [embed], components: [row]})
}
        })
