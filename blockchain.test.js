const Blockchain= require('./blockchain');
const Block=require('./block');
const cryptoHash=require('./crypto-hash');

describe("Blockchain", ()=>{
    let blockchain, newChain; 

    beforeEach(()=>{
        blockchain=new Blockchain();
        newChain= new Blockchain(); 
        originalChain=blockchain.chain;
    })

    // it('contain a chain of array instance', ()=>{
    //     expect(blockchain.chain instanceof Array).toBe(true);
    // });
    it('start with the genesis block', ()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });
    it("adds a new block to the chain", ()=>{
        const newData="foo bar"
        blockchain.addBlock({data:newData});
        
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', ()=>{
        describe('when the chain does not start with the genesis block',()=>{
                it('return false', ()=>{
                    blockchain.chain[0]={data:'fake-genesis'};
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
        });
        describe('when the chain start with the genesis block and has multiple blocks', () => {
            describe('the lastHash refrence has changed', () => {
                it('return false',()=>{
                    blockchain.addBlock({data:'Bears'});
                    blockchain.addBlock({data:"beets"});
                    blockchain.addBlock({data:"battlestar Galtico"});
                    blockchain.chain[2].lastHash='broken-lastHash';
                

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });

            });
            describe('a chain contain a block with invalid fields', () => {
                it('returns false', ()=>{
                    blockchain.addBlock({data:'Bears'});
                    blockchain.addBlock({data:"beets"});
                    blockchain.addBlock({data:"battlestar Galtico"});
                    blockchain.chain[2].data='some-bad-and-evil-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);

                });
            });
            describe('and the chain contains a block with a jumped difficulty', () => {
                it('return false', ()=>{
                    const lastblock=blockchain.chain[blockchain.chain.length-1];
                    const lastHash=lastblock.hash;
                    const timestamp=Date.now();
                    const data=[];
                    const nonce=0;
                    const difficulty=lastblock.difficulty-3;
                    const hash=cryptoHash(timestamp,lastHash,difficulty,nonce,data);
                    
                    const badBlock=new Block({timestamp,lastHash,hash,nonce,difficulty,data})
                    blockchain.chain.push(badBlock);
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                })
            })
            
            describe('the chain does not contain any invalid field', () => {
                it('return true',()=>{

                });
            })
            
            
            
        })
        
    });
describe('replaceChain', () => {
        let errorMock, logMock;
        beforeEach(()=>{
            //  replace the global console log with jestfn
            errorMock= jest.fn();
            logMock=jest.fn();
            
            global.console.error=errorMock;
            global.console.log=logMock;

        });
        describe('the new chain is not longer', () => {
            beforeEach(()=>{
                newChain.chain[0]={new:'chain'};
                blockchain.replaceChain(newChain.chain);
            });
            it('it does not replace the chain',()=>{
                expect(blockchain.chain).toEqual(originalChain);
            });
            // it('logs an error',()=>{
            //     expect(errorMock).toHaveBeenCalled();
            // });
        });

        describe('the new chain is longer', () => {
            beforeEach(()=>{
                newChain.addBlock({data:'Bears'});
                newChain.addBlock({data:"beets"});
                newChain.addBlock({data:"battlestar Galtico"});
            });
            describe('the new chain is invalid', () => {
                beforeEach(()=>{
                    newChain.chain[2].hash= 'some fake hash';
                    blockchain.replaceChain(newChain.chain);
                    
                });
                it('it does not replace the chain',()=>{
                    expect(blockchain.chain).toEqual(originalChain);
                });
        //         it('logs an error',()=>{
        //             expect(errorMock).toHaveBeenCalled();
        //         });

             });
            describe('the chain is valid', () => {
                beforeEach(()=>{
                    blockchain.replaceChain(newChain.chain);
                });
                it('repaces the chain',()=>{
                   
                    expect(blockchain.chain).toEqual(newChain.chain); 
                });
                // it('log about the chain replacement',()=>{
                //     expect(logMock).toHaveBeenCalled(); 
                // });
            });
            
            
            
        })
        
        
        
     })
    

});


