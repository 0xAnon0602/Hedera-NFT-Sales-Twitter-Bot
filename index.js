const { TwitterApi } = require("twitter-api-v2");
const fs = require('fs')
require('dotenv').config()

const fetch = require('node-fetch')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var mainZuseAccount = `0.0.2254995`

let rawdata = fs.readFileSync('tokenID.json');
var tokenID = JSON.parse(rawdata);


const downloadFile = (async (url,marketplace) => {
    try{
        if(marketplace=='SentX'){
            const extension = url.slice(-3)
            if(extension=="jpg"){
            url = url.replace("w32","w500")
        }
    }
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


function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
}

const client = new TwitterApi({
    appKey: process.env.API_Key,
    appSecret: process.env.API_Secret,
    accessToken: process.env.Access_Token,
    accessSecret: process.env.Access_Token_Secret,
    bearerToken:process.env.Nh
});

const rwClient = client.readWrite;


async function tweet(nftName,nftSerial,value,marketplace,collectionURL,imagFile) {

    if(imagFile!=undefined && imagFile!="undefined"){

    const mediaId = await client.v1.uploadMedia(imagFile);
        
        if(mediaId.length!=0){

        try {

            await rwClient.v2.tweet({
                text: `${nftName} #${nftSerial} bought for ${value}ℏ  on ${marketplace}\n${collectionURL}`,
                media: { media_ids: [mediaId] },
            });
            console.log(`Tweeted Successfully`)  
            
        } catch (error) {
            console.error(error);
            console.log(`Cotinuing without attachment`)
            try {
                await rwClient.v2.tweet(`${nftName} #${nftSerial} bought for ${value}ℏ  on ${marketplace}\n${collectionURL}`);
                console.log(`Tweeted Successfully`)  
              } catch (error) {
                console.error(error);
              }
        }

    }else{
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
       ----  Twitter Sales Bot is Online! ----
        `
    )

    var timeStampZuse = Math.floor(Date.now() / 1000)
    var timeStampHashguild = Math.floor(Date.now() / 1000)
    var timeStampSentient = Math.floor(Date.now() / 1000)


  while(true){

    // FOR ZUSE MARKETPLACE

    while(true){
        try{

    // To get new transactions in interval of 1 second

    var url=`https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?account.id=${mainZuseAccount}&limit=100&order=desc&timestamp=gt%3A${timeStampZuse}&transactiontype=cryptotransfer&result=success`


    var opts = {
        headers:{
            'accept': 'application/json'
        }
    }
    
    var response = await web_call(url,opts)


    var transactions = (response['transactions'])

    for(var tx of transactions){

        var txID = tx['transaction_id']
    
        while(true){
            try{

        // To get each transactions i nfo

        var url=`https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/${txID}?nonce=0`

        var opts = {
            headers:{
                'accept': 'application/json'
            }
        }
        
        var response = await web_call(url,opts)
        break

            }catch(e){console.log(e)
            console.log(`Retrying API request (2)`)
            }
        }
        
        var mainTx = (response['transactions'][0]['nft_transfers'])
        var mainTransfers = (response['transactions'][0]['transfers'])

        for (nftTx of mainTx){
            var nftTokenId = nftTx['token_id']
            var nftSerial = nftTx['serial_number'] 
            var buyer = nftTx['receiver_account_id']
            var seller = nftTx['sender_account_id']
        }

        for(transfers of mainTransfers){
            if (transfers['account']==buyer){
                var value = Math.abs(parseInt(transfers['amount']))/10**8
            }
        }

   
        while(true){
            try{

        // To get NFT NAME from TOKEN ID 

        var url=`https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${nftTokenId}`

        var opts = {
            headers:{
                'accept': 'application/json'
            }
        }
        
        var response = await web_call(url,opts)
        break

            }catch(e){console.log(e)
            console.log(`Retrying API request (3)`)
            }
        }

        var nftName = response['name']

        // TO GET NFT IMAGE 

        var nftImage = `https://zmedia.b-cdn.net/file/z35e-awg5/media/${nftTokenId}/${nftSerial}`

        // TO GET HBAR PRICE

        // while(true){
        //     try{

        // var priceData = await CoinGeckoClient.simple.price({
        //     ids: ['hedera-hashgraph'],
        //     vs_currencies: ['usd'],
        // }); 
        
        // var coinPrice = (priceData['data']['hedera-hashgraph']['usd']*value).toFixed(2)
        // break

        //     }catch(e){
        //         console.log(e)
        //         console.log(`Retrying Coingecko API`)
        //     }
        // }

        while(true){
            try{
                

                await downloadFile(nftImage,'Zuse')

                var imageSize = parseInt(((await fs.statSync('NftFile.jpg')).size)/1024)

                var NftFile = 'NftFile.jpg'

                if(imageSize>2000){
                await fs.renameSync('NftFile.jpg', 'NftFile.mp4')
                NftFile = 'NftFile.mp4'
                }

                break

            }catch(e){
                console.log(e)
            }
        }

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
        


        await tweet(nftName,nftSerial,value,`Zuse Marketplace`,`https://zuse.market/collection/${nftTokenId}`,NftFile)
        
        await sleep(10*1000)
         
        }
    }

    break

    }catch(e){console.log(e)
    console.log(`Retrying API request (1)`)
    }

    }
    
    if (transactions.length!=0){
        timeStampZuse = parseInt(transactions[0]['consensus_timestamp'])+1
    }

    // FOR SENTIENT MARKETPLACE

    while(true){
        try{
    
    // To get new transactions in interval of 1 second
    var url=`https://hederasentientbackend.azurewebsites.net/getactivityMarketplace`
    
    
    var opts = {
        method: "POST",
        headers:{
            'accept': 'application/json'
        },       
        body: JSON.stringify({
            "f": null,
            "a": null,
            "page": 1,
            "amount": 25,
            "activityFilter": "Sales"
        })
    }
    
    var response = await web_call(url,opts)
    
    
    var transactions = (response['response'])
    let reversedTransactions = transactions.map((e, i, a)=> a[(a.length -1) -i])
    
    for(var tx of reversedTransactions){
    
            var saleTypeId = tx['saleTypeId']
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
    
            while(true){
                try{
                    
    
                    await downloadFile(nftImage,'SentX')
    
                    var imageSize = parseInt(((await fs.statSync('NftFile.jpg')).size)/1024)
    
                    var NftFile = 'NftFile.jpg'
    
                    if(imageSize>2000){
                    await fs.renameSync('NftFile.jpg', 'NftFile.mp4')
                    NftFile = 'NftFile.mp4'
                    }
    
                    break
    
                }catch(e){
                    console.log(e)
                }
            }
    

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
        

        await tweet(nftName,nftSerial,value,`Sentient Marketplace`,`https://hederasentient.com/nft-marketplace/${nftTokenId}`,NftFile)
        
        await sleep(10*1000)

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

    // FOR HASHGUILD MARKETPLACE

    while(true){
        try{
        
        var query = `
        query GetTransactionActivity($orderBy: [TransactionOrderByWithRelationInput!], $take: Int, $where: TransactionWhereInput) {
          transactions(orderBy: $orderBy, take: $take, where: $where) {
            buyer {
              nickname
              accountId
              __typename
            }
            seller {
              nickname
              accountId
              __typename
            }
            transactedNft {
              token
              serialNo
              name
              listingPrice
              isVerified
              imageUrl
              id
              creator
              favoritedByIds
              isForSale
              isVideoNft
              __typename
            }
            id
            dateOfTransaction
            transactionType
            hbarTransacted {
              price
              __typename
            }
            __typename
          }
        }
        `
        
        var url  = `https://hashguild.xyz/api/graphql`
        var variables = {
            "where": {
                "transactionType": {
                    "equals": "SALE"
                },
                "successful": {
                    "equals": true
                },
                "transactedNft": {
                    "isNot": null
                }
            },
            "orderBy": [
                {
                    "dateOfTransaction": "desc"
                }
            ],
            "take": 100
        }
        
        var opts = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query,      
              variables
            })
          }
        
    
        var response = await web_call(url,opts)
        
        var transactions = (response['data']['transactions'])

        
        var tempTimestamp = timeStampHashguild
        
        for(var tx of transactions){
        
        
            if(parseInt(toTimestamp(tx['dateOfTransaction'])) > timeStampHashguild){
                
        
                if(parseInt(toTimestamp(tx['dateOfTransaction'])) > tempTimestamp){tempTimestamp = parseInt(toTimestamp(tx['dateOfTransaction']))}
        
            
        
                        var nftTokenId = tx['transactedNft']['token']
                        var buyer = tx['buyer']['accountId']
                        var seller = tx['seller']['accountId']
                        var value = tx['hbarTransacted']['price']
                        var nftImage = tx['transactedNft']['imageUrl']
                        var nftSerial = tx['transactedNft']['serialNo']
        
               
                        while(true){
                            try{
            
                        var url=`https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${nftTokenId}`
            
                        var opts = {
                            headers:{
                                'accept': 'application/json'
                            }
                        }
                        
                        var response = await web_call(url,opts)
                        break
            
                            }catch(e){console.log(e)}
                        }
        
                        var nftName = response['name']
             
                        // while(true){
                        // try{

                        // var priceData = await CoinGeckoClient.simple.price({
                        //     ids: ['hedera-hashgraph'],
                        //     vs_currencies: ['usd'],
                        // }); 
                        
                        // var coinPrice = (priceData['data']['hedera-hashgraph']['usd']*value).toFixed(2)
                        // break

                        // }catch(e){
                        //     console.log(e)
                        //     console.log(`Retrying Coingecko API`)                        
                        //     }
                        // }   

                        
                        while(true){
                            try{
                                

                                await downloadFile(nftImage,'Hashguild')

                                var imageSize = parseInt(((await fs.statSync('NftFile.jpg')).size)/1024)

                                var NftFile = 'NftFile.jpg'

                                if(imageSize>2000){
                                await fs.renameSync('NftFile.jpg', 'NftFile.mp4')
                                NftFile = 'NftFile.mp4'
                                }

                                if (imageSize<5){
                                    NftFile=undefined
                                }

                                break

                            }catch(e){
                                console.log(e)
                            }
                        }

        
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
                        `)


                    
                    await tweet(nftName,nftSerial,value,`HashGuild Marketplace`,`https://hashguild.xyz/collection/${nftTokenId}`,NftFile)
                    
                    await sleep(10*1000)
        
                    }

            }
        }
        
        break
        }catch(e){
            console.log(`Retrying again GRAPHQL request`)
            await sleep(1*1000)
        }
        }

    timeStampHashguild = tempTimestamp
        

await sleep(1*1000)


}


}

main()


