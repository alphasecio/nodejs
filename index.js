/*
1. connecting to mongodb test_database and collect data from two collections
2. from frist collectiion, retrives the links and scrape product data
3  checking if the title is present in 2nd collection or not
4. if doen not exist add to database 2nd collection & if exist, check that product price is decresed, increased or not change
5.  if price incresed or decresed , it updates with new price and sends an msgg to telegram bot
*/
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');
const TelegramBot = require('node-telegram-bot-api');

// MongoDB connection URI
const uri = 'mongodb+srv://kongaleela123:Nitishkumar2002@cluster1.peswbwo.mongodb.net/';

// Database name
const dbName = 'test_database';

const bot = new TelegramBot('6901177738:AAGxD0U452Gks2fzLCnm32PmUg6Qbcv-LRQ', { polling: false });
const channelId = '-1002134255316';

async function emulateHumanBehavior() {
    // Random delay between 2 to 5 seconds
    const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
    await delayExecution(delay);
}

function delayExecution(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeProductPage(page, url, title) {
    const clip = {
        x: 0,
        y: 0,
        width: 750,
        height: 700
      };

    try {
        // Set user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        // Set viewport
        await page.setViewport({ width: 1366, height: 768 });
        // Emulate human-like behavior
        await emulateHumanBehavior();
        await page.goto(url)
        await page.waitForSelector("#imgTagWrapperId img");
        // Take screenshot
        const screenshotPath = `${'images/'}${title}.png`;
        await page.screenshot({ path: screenshotPath, clip: clip });
        return screenshotPath
    } catch (error) {
        console.error('Error scraping product page:', error);
        return null;
    }
}

async function sendMessageWithImage(page, message, link, title) {
    try {
        
        // Send image
        const image = await scrapeProductPage(page, link, title);
        await bot.sendPhoto(channelId, image, { caption: message });

        console.log('Message and image sent successfully:', message);
    } catch (error) {
        console.error('Error sending message and image:', error);
    }
}


async function scrapeAmazonProductPage(url, page) {
    try {
        // Set user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        // Set viewport
        await page.setViewport({ width: 1366, height: 768 });
        // Emulate human-like behavior
        await emulateHumanBehavior();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        

        // Extract title
        const title = await page.$eval('div#titleSection span.a-size-large', element => element.textContent.trim());

        // Extract price
        let price = await page.$eval('span.a-price-whole', element => element.textContent.trim());
        
        if (!price) {
            price = await page.$eval('#priceblock_dealprice', element => element.textContent.trim());
        }

        return { title, price };
    } catch (error) {
        console.error('Error scraping product page:', error);
        return null;
    }
}

async function retrieveDataAndScrape() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db(dbName);
        const originalPriceCollection = database.collection('test_collection');
        const priceDataCollection = database.collection('price_data');

        // Retrieve all documents from the original_price collection
        const products = await originalPriceCollection.find().toArray();

        // Store all links in an array
        const links = products.map(product => product.link);

        // Launch the browser
        const browser = await puppeteer.launch();
        
        let c = 0;
        // Iterate through each link
        for (const link of links) {
            c++;
            const page = await browser.newPage();
            console.log(`Scraping ${c}/${links.length} `);

            const { title, price } = await scrapeAmazonProductPage(link, page);

            // Check if the title exists in price_data collection
            const existingProduct = await priceDataCollection.findOne({ title });

            if (existingProduct) {
                console.log(`Title already exists in price_data collection`);

                // Compare prices
                const existingPrice = existingProduct.price;
                if (existingPrice === price) {
                    console.log(`Price for "${c}" is unchanged`);
                } else if (existingPrice > price) {
                    console.log(`Price for "${c}" has decreased from ${existingPrice} to ${price}`);

                    const msg = `"${title}"\n\nPrice drop from ${existingPrice} to ${price}\n\n${link}`;

                    await sendMessageWithImage(page, msg, link, title);
                    // Update the price in the collection
                    await priceDataCollection.updateOne(
                        { title },
                        { $set: { price } }
                    );
                    console.log(`Price updated for "${c}"`);
                } else {
                    console.log(`Price for "${c}" has increased from ${existingPrice} to ${price}`);
                    // Update the price in the collection
                    await priceDataCollection.updateOne(
                        { title },
                        { $set: { price } }
                    );
                    console.log(`Price updated for "${c}"`);
                }
            } else {
                console.log(`Title "${c}" does not exist in price_data collection, inserting...`);
                await priceDataCollection.insertOne({ title, price, link });
                
            }

            // Close the page after scraping
            await page.close();
        }

        // Close the browser after scraping all links
        await browser.close();

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

retrieveDataAndScrape();
