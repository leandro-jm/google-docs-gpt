var ui = DocumentApp.getUi();
var userProperties = PropertiesService.getUserProperties();

var API_KEY = userProperties.getProperty('api.key');

function onOpen() {
  const ui = DocumentApp.getUi();
  ui.createMenu('Tech .AI')
    .addItem('Generate Text', 'generateText')
    .addItem('Set API key', 'setKey')
    .addItem('Delete API key', 'resetKey')
    .addItem('Delete all credentials', 'deleteAll')
    .addToUi();
}

function setKey(){
  var scriptValue = ui.prompt('Please provide your API key.' , ui.ButtonSet.OK);
  userProperties.setProperty('api.key', scriptValue.getResponseText());
  API_KEY = userProperties.getProperty('api.key');
}

function resetKey(){
  userProperties.deleteProperty(API_KEY);
}

function deleteAll(){
  userProperties.deleteAllProperties();
}

function generateText() 
{
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  var cursor = doc.getCursor();

  const url = "https://api.openai.com/v1/chat/completions";
  const data = {
    model: 'gpt-3.5-turbo',
    messages: [{role: "user", content: cursor.getSurroundingText().getText().toString()}],
    temperature: 0,
    max_tokens: 2000
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer "+API_KEY
    },
    payload: JSON.stringify(data)
  };

  const response = UrlFetchApp.fetch(url, options);
  const jsonResponse = JSON.parse(response.getContentText());
  const generatedText = jsonResponse['choices'][0]['message']['content'];
  cursor.insertText('\n\n'+generatedText.toString())
}



