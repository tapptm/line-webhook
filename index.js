const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const port = process.env.PORT || 4000;

const { WebhookClient } = require("dialogflow-fulfillment");

app.use(morgan("dev"));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Server Is Working......")
})
/**
* on this route dialogflow send the webhook request
* For the dialogflow we need POST Route.
* */
app.post('/webhook', (req, res) => {
  // get agent from request
  let agent = new WebhookClient({request: req, response: res})
  // create intentMap for handle intent
  let intentMap = new Map();
  // add intent map 2nd parameter pass function
  intentMap.set('webhook-demo',handleWebHookIntent)
  // now agent is handle request and pass intent map
  agent.handleRequest(intentMap)
})
function handleWebHookIntent(agent){
  agent.add("Hello I am Webhook demo How are you...")
}

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
