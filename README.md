# Hey Hubot, how are you doing?

# General
This bot is the co-present with @k33g_org & @danielpetisme a Snowcamp 2017 talk about chatbots.

## How does it work
The bot is built on top of Microsoft Cognitive services. Microsoft BingSpeech is used for Speech To Text
and Text to Speech where Microsoft Luis is used for Natrural Language Processing (ie. process use unstructured inputs).

This the steps of every request:
1- The use trigger the microphone by clicking on the icon or use the keyboard shortcut `CTRL+SPACE`.
2- The user's speech (aka. *utterance*) is converted into an *expression*. thanks to BingSpeech.
3- The *expression* is analysed by Luis to extract the user *intent* (basically the command you asked) and the *entities* (your command parameters).
4- Based on you intent and entities the Bot tries to compute a reply.
5- The reply is then converted into a speech (again thanks BingSpeech).

Note: If don't want to talk with your computer you can also just type you request and read the reply instead. :)

The bot is completly stateless, it doesn't store any information between 2 use requests. Basically you have the impression
to talk with Doris (From Finding Nemo). For a demo purpose this feature will not be implemented.

The bot's configuration is store locally.

## How can I customize it?

The *expression* to *intent* conversion is made by a Microsoft Luis application. You can create your own application and set
the subscription and application IDs in the settings page.

The replies are provided by a service. Currently the name of the service is hardcoded in the application settings.
Have a look to the `src/app/services/snowcamp2017-replies.js` service to have an example of intent-reply mapping.

The bot has a classic i18n mechanism (thanks to angular-translate). The reply service should return the reply key and optional parameters.
`angular-translate` will look for the according translation in the message bundles.
To make a difference between the text displayed and the one spoke, the bundles are splitted in 2. For a given key reply (ie. `home.welcome`) there is
an according `speech.home.welcome` key used for the speech.
