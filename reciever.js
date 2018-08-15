var amqp = require('amqplib/callback_api');
var q;
let channel;
amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    q = 'hello';
    channel=ch;
    ch.assertQueue(q, {durable: false});
  
  });
});


console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
