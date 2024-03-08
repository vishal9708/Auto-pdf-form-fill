const hbs = require('handlebars');
const fs = require('fs');
const path = require('path')
const puppeteer = require('puppeteer');


exports.renderPdf = async (isVisible, NAME) => {
    return new Promise(async(resolve, reject) => {
        try {
                console.log('html maker called, ',isVisible, NAME )
                const filePath = path.join(path.resolve(), '/assets/template/template.hbs')

                const html = await fs.readFileSync(filePath, "utf-8")
                
                const compiledTemplate = hbs.compile(html)({isVisible, NAME})
                fs.writeFileSync('assets/final_template.html', compiledTemplate);

                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.setContent(compiledTemplate);
                await page.pdf({ path: 'output.pdf', format: 'A4' });
                await browser.close();
                resolve();
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}