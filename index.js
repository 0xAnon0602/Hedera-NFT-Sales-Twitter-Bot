const { TwitterApi } = require("twitter-api-v2");
const fs = require('fs')
require('dotenv').config()

const fetch = require('node-fetch')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let rawdata = fs.readFileSync('tokenID.json');
var tokenID = JSON.parse(rawdata);

const downloadFile = (async (url) => {
    try{
    const res = await fetch(url);
    const fileStream = fs.createWriteStream('NftFile.jpg');
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
      });
    }catch(e){
        console.log('Something Went Wrong!')
        fs.writeFile('NftFile.jpg', "", function(err) {
            if(err) {
                return console.log(err);
            }
        }); 
    }
  });

web_call = async (url,opts) => {
  
    let response_daily = await fetch(url,opts,{ mode: 'no-cors'});
    const result_daily = await response_daily.json();
    return result_daily

}    


const client = new TwitterApi({
    appKey: process.env.API_Key,
    appSecret: process.env.API_Secret,
    accessToken: process.env.Access_Token,
    accessSecret: process.env.Access_Token_Secret,
    bearerToken:process.env.Bearer_Token
});

const rwClient = client.readWrite;


async function tweet(nftName,nftSerial,value,marketplace,collectionURL,imagFile) {

    if(imagFile!=undefined && imagFile!="undefined"){

        try{

        const mediaId = await client.v1.uploadMedia(imagFile);
        
        try {

            await rwClient.v2.tweet({
                text: `${nftName} #${nftSerial} bought for ${value}ℏ  on ${marketplace}\n${collectionURL}`,
                media: { media_ids: [mediaId] },
            });
            console.log(`Tweeted Successfully`)  
            
        } catch (e) {

	   var e = String(error)
	    
	   if(!(e.includes("Request failed with code 503"))){

            console.log(`Cotinuing without attachment`)
            try {
                await rwClient.v2.tweet(`${nftName} #${nftSerial} bought for ${value}ℏ  on ${marketplace}\n${collectionURL}`);
                console.log(`Tweeted Successfully`)  
              } catch (error) {
                console.error(error);
              }  

	   }else{
	   console.log(`Tweeted Successfully`)	
		}
        }


    }catch(e){
        console.log(`Cotinuing without attachment`)
        try {
            await rwClient.v2.tweet(`${nftName} #${nftSerial} bought for ${value}ℏ  on ${marketplace}\n${collectionURL}`);
            console.log(`Tweeted Successfully`)  
          } catch (error) {
            console.error(error);
          }
    }


    }else{
        try {
            await rwClient.v2.tweet(`${nftName} #${nftSerial} bought for ${value}ℏ  on ${marketplace}\n${collectionURL}`);
            console.log(`Tweeted Successfully`)  
          } catch (error) {
            console.error(error);
        }
    }

      await sleep(1*1000)
}


async function main(){

console.log(
    `
    ----  Hedear Sales Twitter Bot is Online! ----
    `
)

var timeStampSentient = Math.floor(Date.now() / 1000)

  while(true){

    // FOR SENTIENT MARKETPLACE

    while(true){
        try{
    
    // To get new transactions in interval of 1 second
    var url=`https://gbackend.sentx.io/getactivityMarketplace`
    
    
    var opts = {
        method: "POST",
        headers:{
            'accept': 'application/json'
        },       
        body: JSON.stringify({
            "page": 1,
            "amount": 25,
            "activityFilter": "Sales"
        })
    }
    
    var response = await web_call(url,opts)
    
    
    var transactions = (response['response'])
    let reversedTransactions = transactions.map((e, i, a)=> a[(a.length -1) -i])
    
    for(var tx of reversedTransactions){
    
            var saleTypeId = tx['nftSaleTypeId']
            var txTimestampTemp = new Date(tx['saleDate'])
            var txTimestamp = parseInt(txTimestampTemp.getTime()/1000);
    
            if(txTimestamp>=timeStampSentient && saleTypeId==1){
    
            var nftTokenId = tx['tokenAddress']
            var nftSerial = tx['serialId'] 
            var buyer = tx['buyerAddress']
            var seller = tx['sellerAddress']
            var nftName = tx['name']
            var nftImage=tx['imageCDN']
            var value = Math.abs(parseInt(tx['salePrice']))
            var txID = tx['saleTransactionId']

        if(value>=100){
    
            await downloadFile(nftImage,'SentX')
            var NftFile = 'NftFile.jpg'

        if(tokenID.includes(nftTokenId)){
    

            console.log(
            ` 
            Name -> ${nftName}
            Buyer -> ${buyer}
            Seller -> ${seller}
            Nft Contract ->  ${nftTokenId}
            Token ID ->  ${nftSerial}
            Value -> ${value}
            Image -> ${nftImage}
            Tx ID -> ${txID}
            `)
            

            await tweet(nftName,nftSerial,value,`SentX Marketplace`,`https://sentx.io/nft-marketplace/${nftTokenId}`,NftFile)        
            await sleep(10*1000)

        }

        }

        timeStampSentient=txTimestamp
    
    }

    }
    timeStampSentient++
    
    break
    
    }catch(e){console.log(e)
    console.log(`Retrying API request (1)`)
    }
    
    }

await sleep(10*1000)

}


}

main()



