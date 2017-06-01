import outgoing from "./outgoing"

module.exports = (bp, discord, config) => {
  discord.on("messageCreate", msg => {

  // This seems more or less required by the botpress framework
  // It probably shouldn't though !
    bp.db.saveUser({
      id: msg.author.id,
      platform: 'discord',
      gender: null,
      timezone: null,
      locale: null,
      picture_url: null,
      first_name: msg.author.username,
      last_name: null,
    }).then(() => {

      if(config.useSelf.get() === true) {
        if(bp.discord.isSelf(msg.author.id)) {
          bp.middlewares.sendIncoming({
            platform: "discord",
            type: "message",
            user: msg.author,
            text: msg.content,
            channel: msg.channel,
            raw:  msg
          })
        }
      }else{
        if(!bp.discord.isSelf(msg.author.id)) {
          bp.middlewares.sendIncoming({
            platform: "discord",
            type: "message",
            user: msg.author,
            text: msg.content,
            channel: msg.channel,
            raw:  msg
          })
        }
      }

    });

  })

  discord.on("ready", () => {
    bp.middlewares.sendIncoming({
      platform: "discord",
      type: "ready",
      user: "",
      text: "",
      discord: discord,
      raw: discord
    })
  })

  discord.on("typingStart", (event, user) => {
    bp.middlewares.sendIncoming({
      platform: "discord",
      type: "typing",
      user: user,
      channelID: event.id,
      text: "",
      raw:  {"event": event, "user": user}
    })
  })

  discord.on("presenceUpdate", (event) => {
    bp.middlewares.sendIncoming({
      platform: "discord",
      type: "status",
      user: event.user,
      text: "",
      status: event.status,
      game: event.game ? event.game : {type: false, name: false},
      raw:  event
    })
  })
}
