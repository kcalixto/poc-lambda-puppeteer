const dotenv = require("dotenv")

dotenv.config()

const END_EXECUTION = "should_end_execution"

exports.buildPage = async (url = "https://www.google.com") => {
    try {
        const browser = await newBrowser()

        console.log("building page");

        const page = await browser.newPage()

        console.log("page navigating");
        page.goto(url)

        page.setViewport({
            width: 1280,
            height: 720,
        })

        console.log("page built successfully");
        return {
            page, close: async () => {
                await page.close()
                await browser.close()
            }
        }
    } catch (error) {
        console.log("error building page: ", error)
        throw END_EXECUTION
    }
}

async function newBrowser() {
    async function local() {
        console.log("running local");
        try {
            const puppeteer = require("puppeteer")

            const browser = await puppeteer.launch({
                headless: false,
                timeout: 0,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            })

            return browser
        } catch (error) {
            console.log(`error building browser: ${error.message}\n\n${error}`)
            throw END_EXECUTION
        }
    }

    async function remote() {
        console.log("running remote");
        try {
            const chromium = require("@sparticuz/chrome-aws-lambda")

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

    try {
        if (process.env.NODE_ENV === "local") {
            return local()
        }

        return remote()
    } catch (error) {
        throw error
    }
}