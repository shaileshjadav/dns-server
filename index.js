const dgram = require("node:dgram");
const server = dgram.createSocket("udp4");
const dnsPacket = require('dns-packet');

const db = {
    'shailesh.dev':{
        type: 'A',
        ip: "1.2.3.4",
    },
    'blog.shailesh.dev': {
        type: 'CNAME',
        ip: '5.6.7.8'
    }
};

server.on("message", (msg, rinfo) => {
    const incomingReq  = dnsPacket.decode(msg);
    console.log(incomingReq);
    const ipFromDb = db[incomingReq.questions[0].name];

    const ans = dnsPacket.encode({
        'type':'response',
        'id':incomingReq.id,
        flags: dnsPacket.AUTHORITATIVE_ANSWER,
        questions: incomingReq.questions,
        answers: [
            {
                type: ipFromDb.type,
                class:'IN',
                name: incomingReq.questions[0].name,
                data: ipFromDb.ip,
            }
        ]
    })
    
    server.send(ans, rinfo.port, rinfo.address);

});
server.bind(3001, 'localhost');
console.log('Started server on ' + 'localhost' + ':' + 3001);
