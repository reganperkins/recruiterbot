const restify = require('restify');
const {
  BotFrameworkAdapter,
  ConversationState,
  MemoryStorage,
  UserState,
} = require('botbuilder');
const { Bot } = require('./bots/dialogBot');
const { JobProfileDialog } = require('./dialogs/jobProfileDialog');

const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
});

adapter.onTurnError = async (context, error) => {
  console.log('onTurnError', error);
  await context.sendActivity('Oops, something went wrong');
};

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

const dialog = new JobProfileDialog(userState);
const bot = new Bot(conversationState, userState, dialog);

const server = restify.createServer();
server.listen(3978, () => {
  console.log(`${server.name} listening to ${server.url}`);
});

server.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await bot.run(context);
  });
});
