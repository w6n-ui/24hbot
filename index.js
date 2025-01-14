const { Discord, Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, SelectMenuInteraction, SelectMenuOptionBuilder, TextInputComponent, ButtonStyle, DiscordModal, ModalBuilder, ModalField, Interaction, WebhookClient, MessageFlags } = require('discord.js');
const { TOKEN, PREFIX } = require('./JSON/config.json');
const db = require('pro.db')
const { color, emjTrue, emjFalse } = require('./JSON/config.json')
const { Permissions } = require('discord.js');
const { EventEmitter } = require('events');
EventEmitter.defaultMaxListeners = 20;
const fs = require('fs');
const { Modal } = require('discord-modals');
const { Collection } = require('discord.js');
const config = require('./JSON/config.json');


const client = new Client({
  intents: [32767]
});

client.commands = new Collection();
client.events = new Collection();

['commands', 'events'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
})

client.on('messageCreate', async (zaid) => {
    if (zaid.author.bot) return;
    let reactroom = db.get(`autoreact_${zaid.guild.id}`)
    if (zaid.channel.id != reactroom) return;
    if (zaid.member.user.bot) return;
    zaid.react("<a:zEmoji:1197935885379960862>")
    zaid.react("💚")
    zaid.react("🖤")
});



client.on('messageCreate', async (zaid) => {
  if (zaid.author.bot) return; // Ignore messages from bots

  let auto_line = db.get(`autoline_${zaid.guild.id}`);
  if (zaid.channel.id != auto_line) return;

  const line = db.get(`line_${zaid.guild.id}`);
  if (!line) return; // Return if there is no line saved

  zaid.channel.send(line);
});


////////////////////////


const { joinVoiceChannel } = require('@discordjs/voice');
client.on('ready', () => {
    let voice = db.get(`voice`);

    setInterval(async () => {
        client.channels.fetch(voice)
            .then((channel) => {
                const VoiceConnection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator
                });
            }).catch((error) => { return; });
    }, 1000)
});

client.on("guildMemberAdd", async (member) => {
  let wel = db.get(`welcome_${member.guild.id}`);
  const line = db.get(`line_${member.guild.id}`);
  let messagechannel = await member.guild.channels.cache.get(wel);
  let Embed = new MessageEmbed()
      .setColor(color)
      .setAuthor(member.user.tag, member.user.avatarURL())
      .setFooter(member.guild.name, member.guild.iconURL())
      .setThumbnail(member.user.avatarURL({ size: 1024 }))
      .setTimestamp()
      .setDescription(`> ** <a:917392428275728434:1218182673873375284> __${member.guild.name}__ <a:917392428275728434:1218182673873375284>**

> **<a:gold_tyu:1218355022148927558> Welcome : ${member.user} <a:gold_tyu:1218355022148927558> **

> **<a:goldhashtag:1218355716880994405> To Request A Mediator-لطلب وسيط : <#1240236156562702337>  <a:goldhashtag:1218355716880994405>  **

> **<a:goldhashtag:1218355716880994405>𝖨𝖿 You Want To Make Order-لو عايز تعمل اوردر : <#1240236155178586143>  <a:goldhashtag:1218355716880994405>  **

> **<a:goldhashtag:1218355716880994405>  Apply To Team-للتقديم علي الفريق : <#1240236164754051082> <a:goldhashtag:1218355716880994405>**

> **<a:goldhashtag:1218355716880994405>  For Support-للدعم الفني : <#1240236163562733578> <a:goldhashtag:1218355716880994405>**

> ** <a:790892822555131924:1218356103285571696> __𝖧𝖺𝗏𝖾 𝖠 𝖭𝗂𝖼𝖾 𝖳𝗂𝗆𝖾 𝖶𝗂𝗍𝗁 𝖴𝗌__ **<a:790892822555131924:1218356103285571696>`)
      .setImage(line);
  if (messagechannel) {
      messagechannel.send({ content: `${member.user}`, embeds: [Embed] });
  }
});

const zChannelId = '1241596656781099069';
const { MessageAttachment } = require('discord.js');
client.on('messageCreate', async (message) => {
  if (message.channel.id === zChannelId && !message.author.bot) {
    const emojiRegex = /<a?:\w+:\d+>/gu;
    const emojiMatches = message.content.matchAll(emojiRegex);

    for (const emojiMatch of emojiMatches) {
      try {
        const guild = message.guild;

        const emojiId = emojiMatch[0].split(':')[2].slice(0, -1);
        const isAnimated = emojiMatch[0].startsWith('<a:');

        const emojiNameMatch = emojiMatch[0].match(/:(\w+):/u);
        const emojiName = emojiNameMatch ? emojiNameMatch[1] : 'AutoEmoji'; 

        const emoji = await guild.emojis.create(`https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? 'gif' : 'png'}`, emojiName);

        console.log(`Emoji added: ${emoji}`);
        message.reply(`Emoji added: ${emoji}`);
      } catch (error) {
        console.error('Error adding emoji:', error);
        message.reply('Error adding emoji. Please check the console for details.');
      }
    }
  }
});
client.on('messageCreate', message => {
    if (message.channel.id === '1240236137067319328') { // replace with your feedback channel id
        if (message.author.bot) return;
        const embed = new MessageEmbed()
            .setTitle('Thank you for your feedback!')
            .setDescription(`شكرا ${message.author}, على التقيم نتمنى نشوفك تاني`)
            .setColor('064c87')
            .setFooter('Voila S', '') // replace with your banner link
            .setThumbnail('https://i.postimg.cc/j2LM1y47/animated-vo-logo.gif') // replace with your GIF link
            .setImage('https://i.postimg.cc/ZnTG6RKy/5-1.png') // replace with your long line pic link
            .setTimestamp();
        message.reply({ embeds: [embed] });
    }
});
const roleIds = {
  Nitro1M: '1221434709830140028',
  Nitro3M: '1221756279253368852',
  Facebook: '1221434715605700709',
  Instagram: '1221434712220893194',
  TikTok: '1221434706818502656',
  'Netflix Account': '1221434718927589376',
  Spotify: '1221434719560929321',
  'Shahid VIP': '1221434727886491719',
  'Server Boosts': '1221434725470703617',
  Server: '1221434740427591710',
  Credit: '1221434714725027910',
  Designer: '1221434708022268005',
  Visa: '1221434717774024815',
  'UC PUBG': '1221434724246093876',
  Steam: '1221434729598025848',
  'Discord Account': '1221434735616720908',
  Roblox: '1220792709506404462',
  Fifa: '1221434736837394462',
  Pes: '1221434716524380160',
  'Bounty Rush': '1221434741216116857',
  Developer: '1221434705203691540',
  Bots: '1221434721578258439',

};

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isSelectMenu() || interaction.customId !== 'select') return;
  const chosenOption = interaction.values[0];
  const roleId = roleIds[chosenOption];
  const roleMention = roleId ? `<@&${roleId}>` : '';
  await interaction.channel.send({ content: roleId ? `${roleMention} انا عملت منشن للسيلرات اهو ياريت تستنا حد يجي و يظبطلك الدنيا و بلاش تسبام الله يسترك` : 'Role ID not found. Please contact support.' });

  const ticketChannel = interaction.channel;
  if (ticketChannel.type === 'GUILD_TEXT' && ticketChannel.parentId === '') {
    await ticketChannel.setName(`Need-${chosenOption}`);
  }
});

client.on('channelCreate', async (channel) => {
  const ticketChannel = channel;
  if (ticketChannel.type === 'GUILD_TEXT' && ticketChannel.parentId === '') {
    setTimeout(async () => {
      const selectOptions = [
        { label: 'Nitro 1 Month', description: '', value: 'Nitro1M', emoji: '<a:Nitro_Classic:1220759053370785853>' },
        { label: 'Nitro 3 Months', description: '', value: 'Nitro3M', emoji: '<a:LD_Nitro_Gaming:1220759100535603290>' },
        { label: 'Feekbook', description: 'Followers / Likes', value: 'Facebook', emoji: '<:fecbok:1220759200943308841>' },
        { label: 'Instagram', description: 'Followers / Likes', value: 'Instagram', emoji: '<a:INSTAGRAM3:1221890711465496650>' },
        { label: 'TikTok', description: 'Followers / Likes / Views', value: 'TikTok', emoji: '<:TikTok:1221890928906862782>' },
        { label: 'Netflix Account', description: '', value: 'Netflix Account', emoji: '<a:Netflix:1221891098977243208>' },
        { label: 'Spotify', description: '', value: 'Spotify', emoji: '<:Spotify:1221891243378868244>' },
        { label: 'Shahid VIP', description: '', value: 'Shahid VIP', emoji: '<:MV_Shahid:1221891416113025098>' },
        { label: 'Server Boosts', description: 'لشراء بوستات', value: 'Server Boosts', emoji: '<a:BoosterBadgesRoll:1221891595805266093>' },
        { label: 'Server', description: 'عمل السيرفر من حيث الرومات و الرولات و البرمشن', value: 'Server', emoji: '<:Server_Tag:1221891866673287218>' },
        { label: 'Credit', description: 'عملات بروبوت', value: 'Credit', emoji: '<:credit_4:1221892010458218688>' },
        { label: 'Designer', description: 'لو محتاج اي تصميم', value: 'Designer', emoji: '<:Photoshop_CC_icon:1221892136623149178>' },
        { label: 'Visa', description: 'لتفعيل نايترو', value: 'Visa', emoji: '<:Visa:1221892233473822793>' },
        { label: 'UC PUBG', description: '', value: 'UC PUBG', emoji: '<:Uc:1221892318785966121>' },
        { label: 'Steam', description: '', value: 'Steam', emoji: '<:Steam_Logo:1221892434821382194>' },
        { label: 'Discord Account', description: 'شراء حسابات ديسكورد او يوزرات', value: 'Discord Account', emoji:'<a:Discord:1221892572486696962>'},
        { label: 'Roblox', description: '', value: 'Roblox', emoji: '<:Roblox:1221892710810517615>' },
        { label: 'Fifa', description: '', value: 'Fifa', emoji: '<:FIFA:1039836770403090512>' },
        { label: 'Pes', description: '', value: 'Pes', emoji: '<:pes:1221892914532061275>' },
        { label: 'Bounty Rush', description: '', value: 'Bounty Rush', emoji: '<:bountyrushicon:1186418788451745832>' },
        { label: 'Developer', description: 'لو محتاج بوت سيستم خاص بيك', value: 'Developer', emoji: '<a:adev_icon:1221893122007498762>' },
        { label: 'Bots', description: 'لو عايز تدخل بوتات سيرفرك مع ظبط اعدادتها', value: 'Bots', emoji: '<a:3160botdiscord:1222133702390448160>' },

        // Add more options here...
      ];
       const selectMenu = new MessageSelectMenu()
        .setCustomId('select')
        .setPlaceholder('Please choose an option...')
        .addOptions(selectOptions);

      const row = new MessageActionRow().addComponents(selectMenu);

      const embed = new MessageEmbed()
      .setColor('064c87')
      .setTitle('Products List in 𝐆𝐨𝐚𝐭 𝐒𝐭𝐨𝐫𝐞')
      .setDescription('**Please choose a product from the list-الرجاء اختيار المنتج من القايمة**')
      .setImage('')
      .setTimestamp();

    const additionalButton = new MessageButton()
      .setLabel('Support')
      .setStyle('LINK')
      .setURL('https://discord.com/channels/1217792140004823061/1218466677419933766'); // Replace this with the support link

   const additionalRow = new MessageActionRow().addComponents(additionalButton);

    await channel.send({ embeds: [embed], components: [row, additionalRow] });

    const collector = channel.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      time: 60000,
    });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'select') {
        const chosenOption = interaction.values[0];
        await channel.setName(chosenOption);
      }
    });
collector.on('collect', async (interaction) => {
      if (interaction.customId === 'select') {
        const chosenOption = interaction.values[0];
        await channel.setName(chosenOption);
    
        // Remove the select menu
        await interaction.message.delete();
    
        // Remove the bot's embed message
        const messages = await channel.messages.fetch({ limit: 10 });
        const botMessages = messages.filter(msg => msg.author.id === client.user.id && msg.embeds.length > 0);
        for (const msg of botMessages.values()) {
          await msg.delete();
        }
    
        // Reply to the interaction to avoid transaction failed
        await interaction.reply({ content: `لوسمحت استنا اي حد من السيلرات يجيلك `, ephemeral: true });
    
        // Wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
    
        // Edit the interaction reply after 5 seconds
        await interaction.editReply({ content: `نورت الدنيا كلها يا زمالة`, ephemeral: true });
      }
    });
  }, 2000); // 5000 milliseconds = 5 seconds
}
});
    // discord.gg/voilla
    //discord/gg/voilla
    //////////////////////////////////
    client.on("messageCreate", message => {
      if (message.channel.type === "dm" || message.author.bot) return;
  
      let autotax = db.get(`ctax_${message.guild.id}`);
      if (!autotax || !autotax.includes(message.channel.id)) return;
  
      let args = message.content.trim().split(/ +/);
      if (!args[0]) return;
  
      let amountStr = args[0];
      let amount = parseInt(amountStr.endsWith("m") ? amountStr.slice(0, -1) * 1000000 : amountStr.endsWith("k") ? amountStr.slice(0, -1) * 1000 : amountStr);
  
      if (isNaN(amount)) return message.reply("Invalid amount provided.");
  
      let tax = Math.floor(amount * (20 / 19) + 1);
  
      message.reply(`**__${tax}__**`).catch(console.error);
  });
    //discord/gg/voilla
    //////////////////////////////////       
client.on("messageCreate", async (message) => {
  // التحقق من أن الرسالة في القناة المحددة
  if (message.channel.id !== "1240236138275278888") return;

  // التحقق من وجود عبارة "has transferred" في محتوى الرسالة
  if (message.content.includes("has transferred")) {
      try {
          // إرسال الصورة في القناة
          message.channel.send({
              files: ['https://media.discordapp.net/attachments/1328096864653938698/1328372572047413330/line.png?ex=6787c85d&is=678676dd&hm=7e876074f59abbda7cbc3bfef41226ed29e8a6a737b14c1e57b4182432f26aa3&=&format=webp&quality=lossless&width=1348&height=67']
          });
      } catch (error) {
          // في حالة حدوث خطأ، قم بطباعة الخطأ في وحدة التحكم
          console.error("Error sending image:", error);
      }
  }
});
client.on('channelCreate', channel => {
  if (channel.type === 'GUILD_TEXT') {
    const categoryId = ''; // Replace YOUR_CATEGORY_ID with the actual category ID
    if (channel.parentId === categoryId) {
      setTimeout(() => {
        const ticketChannel = channel;
        ticketChannel.send(`> **<a:aemoji_:1218339038197710880> التحويل بيتم علي رقم الرسمي السيرفر او الحساب الخاص بالسيرفر في حالة المبالغ الكبيرة <a:aemoji_:1218339038197710880>**
      
> **<a:aemoji_:1218339038197710880> ايدي الطرف الاول<a:aemoji_:1218339038197710880>**
      
> **<a:aemoji_:1218339038197710880>ايدي الطرف الثاني <a:aemoji_:1218339038197710880>**
      
> **<a:aemoji_:1218339038197710880> نوع السلعة <a:aemoji_:1218339038197710880>**
      
> **<a:aemoji_:1218339038197710880>  طريقة الدفع<a:aemoji_:1218339038197710880>**

> **<a:aemoji_:1218339038197710880> لو في اي اتفاق زيادة بينك و بين البايع ياريت تبلغ <a:aemoji_:1218339038197710880>**
`);
      }, 2000); // 5 seconds
    }
  }
});

client.login(TOKEN);