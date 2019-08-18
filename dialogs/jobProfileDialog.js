/* eslint-disable class-methods-use-this */
const {
  DialogSet,
  WaterfallDialog,
  ComponentDialog,
  DialogTurnStatus,
  ChoiceFactory,
  TextPrompt,
  ChoicePrompt,
} = require('botbuilder-dialogs');

const JOB_WATERFALL_DIALOG = 'jobWaterfallDialog';
const INTRO_PROMPT = 'INTRO_PROMPT';
const HAS_A_JOB_READY = 'HAS_A_JOB_READY';

class JobProfileDialog extends ComponentDialog {
  constructor(userState) {
    super('MainDialog'); // id set
    this.jobProfile = userState.createProperty('jobProfile');
    this.addDialog(new ChoicePrompt(INTRO_PROMPT))
      .addDialog(new ChoicePrompt(HAS_A_JOB_READY))
      .addDialog(new TextPrompt('TextPrompt'))
      .addDialog(new WaterfallDialog(JOB_WATERFALL_DIALOG, [
        this.initiateSteps.bind(this),
        this.willTalkToBot.bind(this),
      ]));

    this.initialDialogId = JOB_WATERFALL_DIALOG;
  }

  async run(turnContext, accessor) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(turnContext);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      console.log('CALLED BEGIN DIALOG')
      await dialogContext.beginDialog(this.id);
    }
  }

  async initiateSteps(stepContext) {
    return stepContext.prompt(INTRO_PROMPT, {
      prompt: 'Hi! \n\n My name is Regan. I am a Front end developer mostly interested in Javascript, React, Redux and Node projects. If you have a job opportunity for me please use this bot.\n\nWhy you might ask? This way we both know if the project is one im interested in before we start talking and I don\'t get overwhelmed in my inbox and linkedIn',
      choices: ChoiceFactory.toChoices(['Let\'s do this!', 'I hate this, goodbye'])
    });
  }

  async willTalkToBot(stepContext) {
    // @TODO what happens if you type here?
    const { value } = stepContext.result;
    if (value === 'I hate this, goodbye') {
      return stepContext.prompt('TextPrompt', {
        prompt: 'No worries, I hope you find the perfect fit.',
      });
    }
    return stepContext.prompt(HAS_A_JOB_READY, {
      prompt: 'Do you have a specific job in mind?',
      choices: ChoiceFactory.toChoices(['Yes', 'No']),
    });
  }
}

module.exports.JobProfileDialog = JobProfileDialog;
