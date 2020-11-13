import amqp  from 'amqplib'
import chalk from 'chalk'
import to from './helper/to.mjs'

const main = async()=>{
    try {
       let [connRabbitErr, connRabbit] = await to(amqp.connect('amqp://localhost'))
       if (connRabbitErr) throw new Error ('Error connection rabbit')

       let [channelErr, channel]= await to(connRabbit.createChannel())
       if (channelErr) throw new Error ('Error create Channel')

       let queue = 'node-queue'
       let inputArray = process.argv
       let lastMemberInputArray = inputArray[ inputArray.length-1 ]
       let msg = lastMemberInputArray||'Non-Fire'

        console.log(' this is before sent to queue: ', msg)
       channel.assertQueue(queue,{
           durable:true
       })

       channel.sendToQueue(queue, Buffer.from(msg), {
           persistent:true
       })

       console.log("Sent '%s'", msg);1
       setTimeout(() => {
        connRabbit.close()
        console.log(chalk.green('TIME IS UP'))
       }, 2000);
       
        
    } catch (error) {
        console.log(chalk.green('Print Error: ', error));
    }

}

main()