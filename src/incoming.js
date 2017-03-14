import outgoing from "./outgoing"

module.exports = (bp, discord, config) => {
  discord.on("messageCreate", msg => {
    if(config.useSelf.get()) {
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

  })
  discord.on("ready", () => {
    console.log("Discord ready")
  })
}
