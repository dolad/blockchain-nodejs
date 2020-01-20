const Block= require('./block');
const {GENESIS_DATA,MINE_RATE}= require("./config");
const cryptoHash=require('./crypto-hash');
const hexToBinary=require('hex-to-binary');

describe('Block', ()=>{
    const timestamp=2000;
    const lastHash= "foo-hash";
    const hash="bar-hash";
    const data=['blockchain','data'];
    const nonce =1;
    const difficulty=1;
    const block= new Block({ timestamp, lastHash,hash,data,nonce,difficulty});
    

    it('has a timestamp,lastHash,Hash and data property',()=>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });
    describe('genesis()',()=>{
        const blockgenesis= Block.genesis()
        it("return a block instance ", ()=>{
            expect(blockgenesis instanceof Block).toBe(true);
        });
        
         it("returns the genesis `data`", ()=>{
              expect(blockgenesis).toEqual(GENESIS_DATA);
         });
    });
    describe("minedblock", ()=>{
        const lastblock=Block.genesis();
        const data="data mined";
        const minedblock=Block.minedBlock({lastblock, data});
        

        it("return a block instance ", ()=>{
            expect(minedblock instanceof Block).toBe(true);
        });

    
        it("let `lasthash` be `hash` of the previous block", ()=>{
            expect(minedblock.lastHash).toEqual(lastblock.hash);
        });
        it("set the `data`", ()=>{
            expect(minedblock.data).toEqual(data);
        }); 
       
        it("set the `timestamp`", ()=>{
            expect(minedblock.timestamp).not.toEqual(undefined);
        });
        it("create sha256 `hash` based on proper input",()=>{
            expect(minedblock.hash).toEqual(cryptoHash(minedblock.timestamp,minedblock.nonce,minedblock.difficulty,lastblock.hash,data));
        });
        it('set a`hash` that matches  the difficulty criteria',()=>{
            expect(hexToBinary(minedblock.hash).substring(0,minedblock.difficulty))
            .toEqual('0'.repeat(minedblock.difficulty))
        });
        it('adjust the difficulty', ()=>{
            const possibleResults=[lastblock.difficulty+1,lastblock.difficulty-1 ];
            expect(possibleResults.includes(minedblock.difficulty)).toBe(true);
        });
        it("set the `difficulty`", ()=>{
            expect(lastblock.difficulty).not.toEqual(null);
        });

    });
    describe('raisedDifficulty', () => {
        it('it raises dificulty level',()=>{
            expect(Block.adjustDifficulty({
                originalBlock:block, timestamp:block.timestamp+MINE_RATE -100
            })).toEqual(block.difficulty+1);
        });
        it('it lowers the dificulty level',()=>{
            expect(Block.adjustDifficulty({
                originalBlock:block, timestamp:block.timestamp+MINE_RATE+1000
            })).toEqual(block.difficulty-1);
        });
        it('has a limit of 1',()=>{
            block.difficulty=-1
            expect(Block.adjustDifficulty({originalBlock:block})).toEqual(1);
        })
    })
    

});
