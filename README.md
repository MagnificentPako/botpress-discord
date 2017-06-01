# botpress-discord

## Installation

Installing modules on Botpress is simple. By using the CLI, you only need to type this command in your terminal to add the discord module to your bot.
```
botpress install discord
```

It's also possible to install it though the Botpress UI in the modules section. (probably)

## Get started

##### 1. Create a [**new Discord app**](https://discordapp.com/developers/applications/me)
<img alt="Create app" src="/assets/create-app-discord.png" width="500px" />

#### 2. Add a bot user to your app
Just press the "Add bot user button"

#### 3. Copy the newly generated token

#### 4. Insert the token into the config
The config is located at _modules_config/botpress-discord.json_. Insert the token as string at the key "botToken".

#### 5. ????
#### 6. Profit!

## Features

### Incoming

* [Text messages](#text-messages)

### Outgoing

* [Text messages](#text-messages-1)
* [Attachments](#attachments)
* [Images](#images)

## Reference

### Incoming

You can listen to incoming events easily with Botpress by using the built-in "hear" function.
```js
bp.hear({platform: "discord", type: "message", text: /^hello/i}, event => {
	bp.discord.sendText(event.channel.id, "Welcome!")
})
```

#### Text messages
An `event` is sent to middlewares for each incoming text message from Discord.
```js
{
  platform: "discord",
  type: "text",
  user: e.author,
  text: e.content,
  channel: e.channel,
  raw: e
}
```

### Outgoing

#### Text messages
```js
bp.discord.sendText(channelId, text)
```

###### You can also pass extra params to this method (check out (Eris)[https://github.com/abalabahaha/eris] documentation):

```js
bp.discord.sendText( event.channel.id, "Welcome!", { 'embed': {
	title: "I'm an embed!",
	description: "Here is some more info, with **awesome** formatting.\nPretty *neat*, huh?",
}});
```

#### Attachments
```js
bp.discord.sendAttachment(channelId, description, uri)
```

#### Images
```js
bp.discord.sendImage(channelId, uri)
```
