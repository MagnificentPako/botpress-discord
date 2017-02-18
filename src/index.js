const Eris = require("eris")
const outgoing = require("./outgoing")
const incoming = require("./incoming")
const actions = require("./actions")
const Promise = require("bluebird")
import createConfig from "./config"
import _ from "lodash"

let eris = null
let outgoingPending = outgoing.pending

const outgoingMiddleware = (event, next) => {
  if (event.platform !== "discord") {
    return next()
  }
  if(!outgoing[event.type]) {
    return next("Unsupported event type: " + event.type)
  }

  outgoing[event.type](event, next, eris)

}

module.exports = {
  init: function(bp) {

    bp.middlewares.register({
      name: "discord.sendMessages",
      type: "outgoing",
      order: 100,
      handler: outgoingMiddleware,
      module: "botpress-discord",
      description: "Sends out messages that targets platform = slack." +
      " This middleware should be placed at the end as it swallows events once sent."
    })

    bp.discord = {}
    _.forIn(actions, (action,name) => {
      bp.discord[name] = action
      var sendName = name.replace(/^create/, "send")
      console.log("Created action " + sendName)
      bp.discord[sendName] = Promise.method(function() {
        var msg = action.apply(this,arguments)
        msg.__id = new Date().toISOString() + Math.random()
        const resolver = {event: msg}
        const promise = new Promise(function(resolve, reject) {
          resolver.resolve = resolve
          resolver.reject = reject
        })
        outgoingPending[msg.__id] = resolver
        bp.middlewares.sendOutgoing(msg)
        return promise
      })
    })
  },
  ready: function(bp) {
    const config = createConfig(bp)
    eris = new Eris.Client(config.botToken.get())
    eris.connect()
    incoming(bp, eris)

  }
}
