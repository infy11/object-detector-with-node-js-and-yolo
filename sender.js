const amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function(err, conn) {

conn.createChannel((err,ch)=>{

    const q='hello';
    ch.assertQueue(q,{durable:false});
    ch.sendToQueue(q, new Buffer('Hello World!'));
    console.log('send successfully');
})

});