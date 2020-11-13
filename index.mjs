import amqp  from 'amqplib'
import chalk from 'chalk'
import to from './helper/to.mjs'
import express from 'express'
import bodyParser from 'body-parser'


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const PORT = 3120

app.get('/expressMQ/v1/try', (req,res)=>{
    res.status(200).json({
        message:'success',
        status:200,
        data: 'yeay'
    })
})

app.post('/expressMQ/v1/try',(req, res)=>{
    sentToQueueWorker(req.body.message, res)
})

const sentToQueueWorker = async(msg_val, res)=>{
    try {
        let [connRabbitErr, connRabbit] = await to(amqp.connect('amqp://localhost'))
        if (connRabbitErr) throw new Error ('Error connection rabbit')
    
        let [channelErr, channel]= await to(connRabbit.createChannel())
        if (channelErr) throw new Error ('Error create Channel')
    
        let queue = 'node-queue'
        // let inputArray = process.argv
        // let lastMemberInputArray = inputArray[ inputArray.length-1 ]
        // let msg = lastMemberInputArray||'Non-Fire'
        let msg = msg_val
    
        console.log(' this is before sent to queue: ', msg)
        channel.assertQueue(queue,{
            durable:true
        })
    
        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent:true
        })
    
        console.log("Sent '%s'", msg);
        setTimeout(() => {
            connRabbit.close()
            console.log(chalk.green('TIME IS UP'))
            res.status(201).json({
                message:'success',
                status:201,
                data: {message:msg}
            })
        }, 2000);
    } catch (error) {
        console.log(chalk.green('Print Error: ', error));
    }

}



app.listen(PORT, ()=>{
    console.log(
        chalk.blue(`Example express-rabbitMQ serve at PORT: ${PORT}`)
    );
})