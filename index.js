const {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
} = require("discord.js");
const { generateWelcomeImage } = require("./utils/imageGenerator");
const config = require("./config/config");
require("dotenv").config();
require("./server");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  const now = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour12: false,
  });
  console.log(`✅ Bot ${client.user.tag} telah aktif pada ${now}`);

  const logChannel = client.channels.cache.get("1111474077736124506");
  if (logChannel) {
    const embed = new EmbedBuilder()
      .setTitle("✅ Bot Aktif")
      .setDescription(
        `Bot **${client.user.tag}** telah berhasil login dan siap digunakan.`,
      )
      .addFields({ name: "🕒 Waktu Aktif", value: `${now} WIB` })
      .setColor("Gold")
      .setFooter({ text: "SERVER APA" })
      .setTimestamp();
    logChannel.send({ embeds: [embed] });
  }
});

// 📩 Welcome image + DM saat member join
client.on(Events.GuildMemberAdd, async (member) => {
  try {
    await member.send(`Welcome to SERVER APA
:flag_id:
> 1. Baca dulu <#1093559791290421399>
> 2. React :white_check_mark: di channel <#1093826715412865055> untuk verify.

:flag_gb:
> 1. Read first <#1093559791290421399>
> 2. React :white_check_mark: in channel <#1093826715412865055> for verification.`);

    if (config.welcomeSettings.enabled && config.welcomeSettings.imageEnabled) {
      const welcomeChannel = member.guild.channels.cache.get(
        config.welcomeSettings.channel,
      );
      const image = await generateWelcomeImage(member, config.welcomeSettings);
      await welcomeChannel.send({
        content: config.welcomeSettings.message
          .replace("{user}", `<@${member.user.id}>`)
          .replace("{guild}", member.guild.name)
          .replace("{memberCount}", member.guild.memberCount),
        files: [{ attachment: image, name: "welcome.png" }],
      });
      console.log(`✅ Welcome image sent for ${member.user.tag}`);
    }
  } catch (err) {
    console.error(`❌ Gagal kirim welcome: ${err.message}`);
  }
});

// 🧪 Command !!test hanya untuk ID tertentu
client.on(Events.MessageCreate, async (message) => {
  if (
    message.content === "!!test" &&
    message.author.id === "385690877676486657"
  ) {
    await message.author.send(`📩 Simulasi Welcome DM
Welcome to SERVER APA
:flag_id:
> 1. Baca dulu <#1093559791290421399>
> 2. React :white_check_mark: di channel <#1093826715412865055> untuk verify.

:flag_gb:
> 1. Read first <#1093559791290421399>
> 2. React :white_check_mark: in channel <#1093826715412865055> for verification.`);

    const embedVerify = new EmbedBuilder()
      .setTitle("📩 Simulasi Welcome Embed (Verify)")
      .setAuthor({
        name: "SERVER APA",
        iconURL: "https://cdn.discordapp.com/emojis/1103565695201062982.png",
      })
      .setDescription(
        `Halo ${message.author}, terima kasih telah verify.
<a:arrow2:912307391306039316> Baca dulu <#1093559791290421399>
<a:arrow2:912307391306039316> Ambil role kamu di <#1111174758697029653>
<a:arrow2:912307391306039316> Isi juga data dirimu di <#1095226813803921428>`,
      )
      .setColor("Gold")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setImage(
        "https://cdn.discordapp.com/attachments/1103547298492985364/1103562775705436160/welcome-public.jpg",
      )
      .setFooter({
        text: "DINAR CANDY",
        iconURL: "https://cdn.discordapp.com/emojis/1103565695201062982.png",
      })
      .setTimestamp();

    await message.channel.send({
      content: `🎉 Simulasi embed Welcome untuk ${message.author}`,
      embeds: [embedVerify],
    });

    const embedBoost = new EmbedBuilder()
      .setTitle(
        `<a:boost:1111858968504057907> ${message.author.username} telah boost server (simulasi)`,
      )
      .setDescription(
        `${message.author} Terimakasih telah memberikan booster di SERVER APA.\nUntuk **Custom-role**, silahkan hubungi Staff/Admin.`,
      )
      .setColor("Gold")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: "Dinar Candy" })
      .setTimestamp();

    await message.channel.send({
      content: "🌟 Simulasi notifikasi boost:",
      embeds: [embedBoost],
    });
  }
});

// 🎉 Embed Welcome saat verify
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  const welcomeChannel = client.channels.cache.get("1095228633121030216");
  const verifiedRoleId = "1093549373901766726";

  if (
    !oldMember.roles.cache.has(verifiedRoleId) &&
    newMember.roles.cache.has(verifiedRoleId)
  ) {
    const embed = new EmbedBuilder()
      .setTitle("Selamat datang di SERVER APA")
      .setAuthor({
        name: "SERVER APA",
        iconURL: "https://cdn.discordapp.com/emojis/1103565695201062982.png",
      })
      .setDescription(
        `Halo ${newMember.user}, terima kasih telah verify.
<a:arrow2:912307391306039316> Baca dulu <#1093559791290421399>
<a:arrow2:912307391306039316> Ambil role kamu di <#1111174758697029653>
<a:arrow2:912307391306039316> Isi juga data dirimu di <#1095226813803921428>`,
      )
      .setColor("Gold")
      .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
      .setImage(
        "https://cdn.discordapp.com/attachments/1103547298492985364/1103562775705436160/welcome-public.jpg",
      )
      .setFooter({
        text: "DINAR CANDY",
        iconURL: "https://cdn.discordapp.com/emojis/1103565695201062982.png",
      })
      .setTimestamp();

    await welcomeChannel.send(`Hai ${newMember.user}, Welcome !!!`);
    await welcomeChannel.send({ embeds: [embed] });
  }
});

// 🌟 Notifikasi saat user boost server
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  const boostRoleId = "1111573679789314120";
  const boostChannel = client.channels.cache.get("1095223644147417169");
  const logChannel = client.channels.cache.get("1137183538077245521");

  if (
    !oldMember.roles.cache.has(boostRoleId) &&
    newMember.roles.cache.has(boostRoleId)
  ) {
    const embed = new EmbedBuilder()
      .setTitle(
        `<a:boost:1111858968504057907> ${newMember.user.username} telah boost server`,
      )
      .setDescription(
        `${newMember.user} Terimakasih telah memberikan booster di SERVER APA.\nUntuk **Custom-role**, silahkan hubungi Staff/Admin.`,
      )
      .setColor("Gold")
      .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: "Dinar Candy" })
      .setTimestamp();

    if (boostChannel) await boostChannel.send({ embeds: [embed] });
    if (logChannel) await logChannel.send({ embeds: [embed] });

    try {
      await newMember.send(
        `Hai ${newMember.user},\nTerimakasih telah memberikan booster di SERVER APA. Silakan hubungi Staff/Admin untuk Custom Role.`,
      );
    } catch (err) {
      console.error(
        `❌ Gagal kirim DM boost ke ${newMember.user.tag}: ${err.message}`,
      );
    }
  }
});

// 🤖 AI Chat dengan OpenAI
const { Configuration, OpenAIApi } = require("openai");

// Konfigurasi OpenAI
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

// Hanya aktif di channel ID tertentu
const aiChannelId = "1395914961817043044";

// Event pesan masuk untuk AI Chat
client.on(Events.MessageCreate, async (message) => {
  if (
    message.channel.id !== aiChannelId ||
    message.author.bot ||
    message.content.startsWith("!")
  ) return;

  try {
    await message.channel.sendTyping();

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message.content }
      ],
    });

    const reply = response.data.choices[0].message.content;
    message.reply(reply);
  } catch (err) {
    console.error("❌ Gagal menjawab dengan AI:", err);
    message.reply("Maaf, terjadi kesalahan saat memanggil AI.");
  }
});

client.login(process.env.TOKEN);
