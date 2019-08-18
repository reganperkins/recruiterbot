const {
  DialogSet,
  WaterfallDialog,
  ComponentDialog,
  DialogTurnStatus,
  ChoiceFactory,
} = require('botbuilder-dialogs');

class JobProfileDialog extends ComponentDialog {
  constructor(userState) {
    super();
    this.jobProfile = userState.createProperty('jobProfile');
    this.addDialog(new WaterfallDialog('job-profile-dialog', [
      this.initiateStep,
    ]));
  }

  async run(turnContext, accessor) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(turnContext);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }

  async initiateStep() {
    return await step.prompt('CHOICE_PROMPT', {
      prompt: 'Hi! My name is Regan. I am a Front end developer mostly interested in Javascript, React, Redux and Node projects.\n If you have a job opportunity for me please use this bot. Why you might ask? This way we both know if the project is one im interested in before we start talking and I don\'t get overwhelmed in my inbox and linkedIn',
      choices: ChoiceFactory.toChoices(['Let\'s do this!', 'I hate this, goodbye'])
    });
  }
}

module.exports.JobProfileDialog = JobProfileDialog;
