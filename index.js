const chromium = require("chrome-aws-lambda")

const END_EXECUTION = "should_end_execution"

exports.runner = async () => {
    let browser = {
        close: async () => { console.log("closed without init") }
    };
    try {

        console.log("building puppet..")

        browser = await newBrowser()
        const page = await buildPage(browser)

        console.log("started")

        const inputFieldSelector = "[name=q]"
        await page.waitForSelector(inputFieldSelector)

        console.log("typing")

        await page.type(inputFieldSelector, "oiee")

        console.log("typed successfully")
        await page.click(".gNO89b")

        console.log("waiting for navigation...")
        await page.waitForNavigation()

    } catch (err) {
        console.log("ERROR: ", err)
    } finally {
        try {
            await browser.close()
        } catch (err) {
            console.log("finally error: ", err)
        } finally {
            console.log("finished execution")
        }
    }
}

async function buildPage(browser) {
    try {
        const url = "https://www.google.com"

        console.log("building page");

        const page = await browser.newPage()

        console.log("page navigating");
        page.goto(url)

        page.setViewport({
            width: 1280,
            height: 720,
        })

        console.log("page built successfully");
        return page
    } catch (error) {
        console.log("error building page: ", error)
        throw END_EXECUTION
    }
}

async function newBrowser() {
    try {
        const browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        return browser
    } catch (error) {
        console.log(`error building browser: ${error.message}\n\n${error}`)
        throw END_EXECUTION
    }
}

// runner()