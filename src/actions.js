const createText = (chId, txt) => {
  return {
    platform: "discord",
    type: "text",
    text: txt,
    raw: {
      channelId: chId,
      message: txt
    }
  }
}

module.exports = {
  createText
}
