import { buildPage } from "./browser/puppeteer.cjs"

export const runner = async () => {
    let close = async () => { }
    try {
        console.log("building puppet..")

        const { page, close: killBrowser } = await buildPage("https://www.google.com")

        close = killBrowser

        console.log("started")

        const inputFieldSelector = "[name=q]"
        await page.waitForSelector(inputFieldSelector)

        console.log("typing")

        await page.type(inputFieldSelector, "oiee")
        console.log("typed successfully")

        console.log("pressing enter")
        await page.keyboard.press('Enter');

        // const buttonSelector = ".gNO89b"
        // await page.waitForSelector(buttonSelector)
        // console.log("found search button")

        // await page.click(buttonSelector, { delay: 1500 })
        // console.log("clicked search button")

        console.log("waiting for navigation...")
        await page.waitForNavigation()

    } catch (err) {
        console.log("ERROR: ", err)
    } finally {
        try {
            await close()
        } catch (err) {
            console.log("finally error: ", err)
        } finally {
            console.log("finished execution")
        }
    }
}

if (process.env.NODE_ENV === "local") {
    runner()
}