const embeds = require("./embeds")
import _ from "lodash"

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

const createAttachment = (chId, description, uri) => {
  var filename = uri.split('/').pop().split('#')[0].split('?')[0]
  return {
    platform: "discord",
    type: "attachment",
    text: description,
    raw: {
      filename: filename,
      uri: uri,
      channelId: chId
    }
  }
}

const createImage = (chId, uri) => {
  return {
    platform: "discord",
    type: "image",
    text: "",
    raw: {
      uri: uri,
      channelId: chId
    }
  }
}

module.exports = {
  createText,
  createAttachment,
  createImage
}
