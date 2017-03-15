var rp = require("request-promise")

const handlePromise = (next,promise) => {
  return promise.then(res => {
    next()
    return res
  })
  .catch(err => {
    next(err)
    throw err
  })
}

const handleText = (event, next, discord) => {
  if(event.platform !== "discord" || event.type !== "text") {
    return next()
  }

  const channelId = event.raw.channelId
  const text = event.text
  const raw = (typeof event.raw !== "string") ? event.raw : {}

  return handlePromise(next, discord.createMessage(channelId, {"content": text, "embed": raw}))
}

const handleAttachment = (event, next, discord) => {
  if(event.platform !== "discord" || event.type !== "attachment") {
    return next()
  }

  const channelId = event.raw.channelId
  const description = event.text
  const filename = event.raw.filename
  const uri = event.raw.uri

 var pr = new Promise( (resolve, reject) => {
   rp(uri)
    .then( (str) => {
      resolve(discord.createMessage(channelId, description, {name: filename, file: Buffer.from(str)}))
    })
    .catch( err => {
      reject(err)
    })
 })
  return handlePromise(next, pr)
}

const handleImage = (event, next, discord) => {
  if(event.platform !== "discord" || event.type !== "image") {
    return next()
  }
  const channelId = event.raw.channelId
  const uri = event.raw.uri
  const filetype = event.raw.type || "png"
  const filename = Date.now() + "." + filetype

  var pr = new Promise( (resolve, reject) => {
    rp({uri: uri,encoding: null})
     .then( (buff) => {
       resolve(discord.createMessage(channelId, "", {name: filename, file: Buffer.from(buff)}))
     })
     .catch( err => {
       reject(err)
     })
  })
  return handlePromise(next, pr)

}

const handleTextUpdate = (event, next, discord) => {
  if(event.platform !== "discord" || event.type !== "textUpdate") {
    return next()
  }

  const channelId = event.raw.channelId
  const msgId = event.raw.msgId
  const text = event.raw.msg

  return handlePromise(next, discord.editMessage(channelId, msgId, text))

}

module.exports = {
  "text": handleText,
  "attachment": handleAttachment,
  "image": handleImage,
  "textUpdate": handleTextUpdate,
  pending: {}
}
