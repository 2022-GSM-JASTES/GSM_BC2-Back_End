const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/status', (request, response) => response.json({ clients: clients.length }));

const PORT = 3000;

let clients = [];
let livestreamEvents = [];

app.listen(PORT,'10.82.20.85', () => {
    console.log(`Livestream service starting`)
})

function eventsHandler(request, response, next) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
  
    const data = 'connect'//`data: ${JSON.stringify(livestreamEvents)}\n\n`;
  
    response.write(data);
  
    const clientId = Date.now();
  
    const newClient = {
      id: clientId,
      response
    };
  
    clients.push(newClient);
  
    request.on('close', () => {
      console.log(clientId);
      //clients = clients.filter(client => client.id !== clientId);
    });
  }
  
app.get('/receive', eventsHandler);

function sendEventsToAll(livestreamEvent) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(livestreamEvent)}\n\n`))
}
let bid1 = 1
let bid2 = 1
async function addLivestreamEvent(request, respsonse, next) {
  console.log(request.body.menu)
  if(request.body.menu == undefined){
    bid1++
    request.body.mid = bid1
    request.body.type = 'mining'
  }else{
    bid2++
    request.body.bid = bid2
    request.body.type = 'block'
  }
    
    const livestreamEvent = request.body;
    livestreamEvents.push(livestreamEvent);
    console.log(request.body)
    respsonse.json(livestreamEvent)
    return sendEventsToAll(livestreamEvent);
}

app.post('/send', addLivestreamEvent);