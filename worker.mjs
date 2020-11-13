// const amqp = require('amqplib')
// const to = require('./helper/to');

import amqp from 'amqplib'
// import to from './helper/to'

const to = (promise) =>{
    return promise
    .then(data =>([undefined,data]))
    .catch(error=> Promise.resolve([error, undefined]))
}

const main = async () =>{
    let [connErr, conn] = await to (amqp.connect('amqp://localhost'))
    if(connErr) throw new Error ('Error connect rabbit consumer')

    let [channelErr, channel ] = await to (conn.createChannel())
    if (channelErr) throw new Error ('Error channel rabbit consumer')

    let queueName = 'node-queue'

    channel.assertQueue(queueName,{durable: true})
    channel.consume(queueName, (msg)=>{
        let secs = msg.content.toString().split('.').length
        // console.log('=========');
        // console.log(secs);
        
        console.log('__Received', msg.content.toString())
        setTimeout(() => {
            console.log('[x] Done');
            
        }, secs * 1000);
        
    }, {noAck:true})
    
    // let ok = channel.assertQueue(queueName,{durable: true})
    // ok.then(()=>{
    //     return channel.consume(queueName, 
    //         msg=>{
    //         console.log('__Received', msg.content.toString())},
    //         {noAck : true}
    //     )
    // })
}
main()
