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

  return handlePromise(next, discord.createMessage(channelId, text))
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
  const filename = Date.now() + ".png"

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

module.exports = {
  "text": handleText,
  "attachment": handleAttachment,
  "image": handleImage,
  pending: {}
}
