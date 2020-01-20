const hexToBinary=require('hex-to-binary');

const  {GENESIS_DATA,MINE_RATE}=require('./config');
const cryptoHash=require('./crypto-hash');


class Block{
     constructor({timestamp,lastHash,data,hash,nonce, difficulty}){
        this.timestamp=timestamp;
        this.lastHash=lastHash;
        this.data=data;
        this.hash=hash;
        this.nonce=nonce;
        this.difficulty=difficulty;

    }
    
      static genesis(){
            return new this(GENESIS_DATA);       

    }
     static minedBlock({lastblock,data}){
        const lastHash=lastblock.hash;
        let difficulty=lastblock.difficulty;
        let timestamp, hash;
        let nonce=0;
        

        do {
            nonce++;
            timestamp=Date.now();
            difficulty=Block.adjustDifficulty({originalBlock:lastblock, timestamp})
            hash=cryptoHash(timestamp,lastHash,data,nonce,difficulty);
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({timestamp,lastHash,data,difficulty,nonce,hash});
    }

    static adjustDifficulty({originalBlock,timestamp}){
        const {difficulty}= originalBlock;
        if(difficulty<1) return 1;

        if((timestamp-originalBlock.timestamp) >= MINE_RATE) return difficulty-1;
        return difficulty+1;
    }
}
 

module.exports=Block;

