import outgoing from "./outgoing"

module.exports = (bp, discord) => {
  discord.on("messageCreate", msg => {
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
  })
  discord.on("ready", () => {
    console.log("Discord ready")
  })
}
