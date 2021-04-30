const Discord = require('discord.js');
const client = new Discord.Client({ disableMentions: 'everyone' });
const ytdl = require('ytdl-core');
const ayarlar = require('./ayarlar.json');
const fs = require('fs');
const moment = require('moment');
const keepalive = require("./keepalive.js")
require('./util/eventLoader')(client);


var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};



client.on('message', message =>{
const sa = message.content.toLowerCase()

if(sa === 'sa' || sa === 'sea' || sa === 'selam aleyküm' || sa === 'Selam Aleyküm') {
message.channel.send(`Aleyküm Selam Hoş Geldin <@${message.author.id}>`)
}
})

client.on('message', function(message) {
    if (message.content == "%sil") {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.messages.fetch()
               .then(function(list){
                    message.channel.bulkDelete(list);
                }, function(err){message.channel.send("ERROR: ERROR CLEARING CHANNEL.")})                        
        }
    }

});


client.on("guildMemberAdd", (member) => {
try {
member.guild.setName(`Sunucu İsmi 〔${member.guild.memberCount} Kişi〕`);
}
catch (e) {
console.log(e);
}
});

client.on("guildMemberRemove", (member) => {
try {
member.guild.setName(`Sunucu İsmi 〔${member.guild.memberCount} Kişi〕`);
}
catch (e) {
console.log(e);
}
});

client.on('message', async message => {
   if(message.content.startsWith('%fnf')) {
    message.channel.send("Fnf'de Kötüyüm :d", {files: ["./Image1.png"]});
   }
})

client.on('message', async message=>{
  if(message.content.startsWith('%konus')) {
    const sesler = ['./bedavaarabaisteyen.wav', './nslsn.wav']
    const cvp = sesler[Math.floor(Math.random() * sesler.length)];
    if(message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play(cvp);
      dispatcher.on("end", end => {message.member.voice.channel.leave});
    } else {
      message.reply('Lütfen Sesli Bir Kanala Katıl');
    }
  }
})

client.on('message', async message=>{
  if(message.content.startsWith('%durdur')) {
    if(!message.member.voice.channel) return message.channel.send('Bir Ses Kanalında Değilsin!')
    if(!message.guild.me.voice.channel) return message.channel.send('Ben Bir Ses Kanalında Bile Değilim!')
    if(message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('Üzgünüm Ama Aynı Kanalda Değiliz.')
    message.member.voice.channel.leave()
    message.channel.send('Tm Ayrıldım')
  }
})

client.ws.on('INTERACTION_CREATE', async interaction => {
      const command = interaction.data.name.toLowerCase();
      const args = interaction.data.options;
      const db = require("quick.db");
      if (command == "otorol") {
        if (args[0].name == "ayarla") {
          let role = args[0].options[1].value
          let kanal = args[0].options[0].value
          let guild = client.guilds.cache.get(interaction.guild_id);

          if(!guild.members.cache.get(interaction.member.user.id).hasPermission("ADMINISTRATOR")) return client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: "",embeds: [{color: 0xFF3333,description: 'Yetkiniz bulunmamakta!',timestamp: new Date(),}]}}});
          if(guild.channels.cache.get(kanal).type !== "text") return client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: "",embeds: [{color: 0xFF3333,description: 'Oto rol kanalını **metin** kanalı olarak seçmelisiniz!',timestamp: new Date(),}]}}});
          if(guild.roles.cache.get(role).position > guild.members.cache.get(client.user.id).roles.highest.position) return client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: "",embeds: [{color: 0xFF3333,description: 'Bot oto rol rolüne erişemiyor lütfen botun yetkisini rolün yetkisinden yüksek yapın!',timestamp: new Date(),}]}}});
          
          db.set(`otorol_${interaction.guild_id}_rol`, role)
          db.set(`otorol_${interaction.guild_id}_kanal`, kanal)

          client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: "",embeds: [{color: 0x0099ff,description: 'Oto Rol başarılı bir şekilde ayarlandı!',timestamp: new Date(),}]}}})
        } else if (args[0].name == "düzenle"){ 
          let role = args[0].options[1].value
          let kanal = args[0].options[0].value
          let guild = client.guilds.cache.get(interaction.guild_id);

          let otorol = db.get(`otorol_${guild.id}_rol`)
          let otokanal = db.get(`otorol_${guild.id}_kanal`)

          if(!otorol) return client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: "",embeds: [{color: 0xFF3333,description: 'Oto Rol ayarlı değil!',timestamp: new Date(),}]}}});
          if(!otokanal) return client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: "",embeds: [{color: 0xFF3333,description: 'Oto Rol ayarlı değil!',timestamp: new Date(),}]}}});

          if(!guild.members.cache.get(interaction.member.user.id).hasPermission("ADMINISTRATOR")) return client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: "",embeds: [{color: 0xFF3333,description: 'Yetkiniz bulunmamakta!',timestamp: new Date(),}]}}});
          if(guild.channels.cache.get(kanal).type !== "text") return client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: "",embeds: [{color: 0xFF3333,description: 'Oto rol kanalını **metin** kanalı olarak seçmelisiniz!',timestamp: new Date(),}]}}});
          if(guild.roles.cache.get(role).position > guild.members.cache.get(client.user.id).roles.highest.position) return client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: "",embeds: [{color: 0xFF3333,description: 'Bot oto rol rolüne erişemiyor lütfen botun yetkisini rolün yetkisinden yüksek yapın!',timestamp: new Date(),}]}}});
          
          db.set(`otorol_${interaction.guild_id}_rol`, role)
          db.set(`otorol_${interaction.guild_id}_kanal`, kanal)

          client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: "",embeds: [{color: 0x0099ff,description: 'Oto Rol başarılı bir şekilde ayarlandı!',timestamp: new Date(),}]}}})

        } else if (args[0].name == "sil") {
          let guild = client.guilds.cache.get(interaction.guild_id);

          let otorol = db.get(`otorol_${guild.id}_rol`)
          let otokanal = db.get(`otorol_${guild.id}_kanal`)

          if(!otorol) return client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: "",embeds: [{color: 0xFF3333,description: 'Oto Rol ayarlı değil!',timestamp: new Date(),}]}}});
          if(!otokanal) return client.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4,data: {content: "",embeds: [{color: 0xFF3333,description: 'Oto Rol ayarlı değil!',timestamp: new Date(),}]}}});
          
          db.delete(`otorol_${interaction.guild_id}_rol`)
          db.delete(`otorol_${interaction.guild_id}_kanal`)
        }
      }
  });

  client.on("guildMemberAdd", async (member) => {
    const db = require("quick.db");
    let guild = member.guild;
    let otorol = db.get(`otorol_${guild.id}_rol`)
    let otokanal = db.get(`otorol_${guild.id}_kanal`)

    console.log(otorol)
    console.log(otokanal)

    if(!otorol) return;
    if(!otokanal) return;

    let rol = guild.roles.cache.get(otorol)
    let kanal = guild.channels.cache.get(otokanal)

    if(!rol) return db.delete(`otorol_${guild.id}_rol`);
    if(!kanal) return db.delete(`otorol_${guild.id}_kanal`);

    member.roles.add(rol)
    .then(() => {
      kanal.send(`${member} kullanıcısına \`${rol.name}\` rolü verildi.`).catch(err => { if(err) { db.delete(`otorol_${guild.id}_rol`); db.delete(`otorol_${guild.id}_kanal`); }})
    })
    .catch(err => { if(err) { db.delete(`otorol_${guild.id}_rol`); db.delete(`otorol_${guild.id}_kanal`); }})
  })







client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.on('ready', () => {

  // Oynuyor Kısmı
  
      var actvs = [
        `${prefix}yardım ${client.guilds.cache.size} sunucuyu`,
        
        `${prefix}yardım | https://discord.gg/VuVMuKu5qJ`
    ];
    
    client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)], { type: 'PLAYING' });
    setInterval(() => {
        client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)], { type: 'PLAYING'});
    }, 15000);
    
  
      console.log ('_________________________________________');
      console.log (`Kullanıcı İsmi     : ${client.user.username}`);
      console.log (`Sunucular          : ${client.guilds.cache.size}`);
      console.log (`Kullanıcılar       : ${client.users.cache.size}`);
      console.log (`Prefix             : ${ayarlar.prefix}`);
      console.log (`Durum              : Bot Çevrimiçi!`);
      console.log ('_________________________________________');
    
    });




client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

client.login(process.env.token);
