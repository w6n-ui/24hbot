const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = 'MTMyNTExNjUwNTI1NTMxMzQ2MA.GXrg_R.ycdKKrehAAwCiGHt2Fe6_aJNEHQpD45GDnhP8U'; // استبدلها بتوكن البوت الخاص بك
const channelId = '1324356277899366462'; // استبدلها بمعرف القناة الصوتية

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase() === '!join') {
    try {
      let channel;

      // إذا كان العضو في قناة صوتية، يدخل البوت إليها
      if (message.member.voice.channel) {
        channel = message.member.voice.channel;
      } else {
        // إذا لم يكن العضو في قناة صوتية، يستخدم البوت قناة معينة (حسب معرف القناة)
        channel = message.guild.channels.cache.get(channelId);
      }

      // التأكد من أن القناة الصوتية موجودة
      if (!channel) {
        console.log('لم أتمكن من العثور على القناة!');
        return message.reply('لم أتمكن من العثور على القناة الصوتية!');
      }

      // التأكد من أن القناة هي قناة صوتية باستخدام channel.type
      if (channel.type !== ChannelType.GuildVoice) {
        console.log('القناة ليست قناة صوتية!');
        return message.reply('القناة التي تم تحديدها ليست قناة صوتية!');
      }

      // الانضمام إلى القناة الصوتية
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      console.log(`تم انضمام البوت إلى القناة الصوتية: ${channel.name}`);

      // تشغيل الصوت بشكل مستمر
      const resource = createAudioResource(path.join(__dirname, 'audio.mp3')); // تأكد من وجود ملف audio.mp3 في نفس المجلد
      const player = createAudioPlayer();
      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        player.play(resource); // إعادة تشغيل الصوت بعد الانتهاء
      });

      message.reply(`البوت الآن في الغرفة الصوتية المحددة!`);

      // التأكد من أن البوت لا يخرج من القناة
      connection.on('stateChange', (oldState, newState) => {
        if (newState.status === 'disconnected') {
          connection.subscribe(player); // إعادة الاشتراك في القناة الصوتية إذا تم فصل البوت
        }
      });
    } catch (error) {
      console.error('خطأ أثناء محاولة الانضمام إلى القناة الصوتية:', error);
      message.reply(`حدث خطأ أثناء محاولة الانضمام إلى القناة الصوتية! التفاصيل: ${error.message}`);
    }
  }
});

client.login(token);
