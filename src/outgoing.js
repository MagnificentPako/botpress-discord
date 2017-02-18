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

module.exports = {
  "text": handleText,
  pending: {}
}
