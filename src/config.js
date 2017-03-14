import _ from "lodash"
import createStorage from "./storage"

export default bp => {
  const configKeys = [
    "botToken",
    "useSelf"
  ]

  const configDefaults = {
    botToken: null,
    useSelf: false
  }

  const configStorage = createStorage(bp, configDefaults)

  const config = configStorage.load()

  const createConfigAccessMethods = key => ({
    get: () => config[key],
    set: value => {
      config[key] = value
      configStorage.save(config)
    }
  })

  const accessMethods = _.reduce(configKeys, (acc, key) => ({
    ...acc,
    [key]: createConfigAccessMethods(key)
  }), {})

  const extraMethods = {
    getAll: () => config,
    setAll: (newConfig) => _.forEach(configKeys, key => {
      accessMethods[key].set(newConfig[key])
    })
  }

  return {
    ...accessMethods,
    ...extraMethods,
  }

}
