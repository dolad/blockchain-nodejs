const Blockchain=require('./blockchain');

const blockchain= new Blockchain();
// console.log(JSON.stringify(blockchain.chain[blockchain.chain.length-1]));
let prevTimestamp, nextTimestamp,nextBlock,timeDiff, average;

// console.log('the firstblock', blockchain.chain[blockchain.chain.length-1]);
blockchain.addBlock({data:"initial"});
const times= [];

for (let i = 0; i < 10000; i++) {
    prevBlock=blockchain.chain[blockchain.chain.length-1]
    prevTimestamp=prevBlock.timestamp;
    prevDiff=prevBlock.difficulty;
    
    blockchain.addBlock({data:`block ${i}`});
    nextBlock=blockchain.chain[blockchain.chain.length-1];

    nextTimestamp=nextBlock.timestamp;
    timeDiff=nextTimestamp-prevTimestamp;
    times.push(timeDiff);
    
    // calculate the avarage 
    
    average=times.reduce((total, num)=>(total+num))/times.length;
    //    console.log(`the diffculty is ${JSON.stringify(nextBlock)}`);
    
      console.log(`Time to mine block: ${timeDiff}ms. difficulty: ${nextBlock.difficulty}. average:${average}ms`);
}
