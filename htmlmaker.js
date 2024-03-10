const hbs = require('handlebars');
const fs = require('fs');
const path = require('path')
const puppeteer = require('puppeteer');


exports.renderPdf = async (isDebit, isCash, isCheque, branch, date, isShared, isRemitter, isBeneficiary, isKyc, accountNo, passportNo, serialNo, fundSource, amountInWords, transferCurrency, orderingCustomer, beneficiaryCustomer, beneficiaryBank) => {
    return new Promise(async(resolve, reject) => {
        try {
                // const date = Date.replaceAll("/", " / ");
                const ordCustName = orderingCustomer.name
                const ordCustAddress = orderingCustomer.address
                const ordCustCity = orderingCustomer.city
                const benCustName = beneficiaryCustomer.name
                const benCustAddress = beneficiaryCustomer.address
                const benCustCity = beneficiaryCustomer.city
                const benBankAccountNo = beneficiaryBank.accountNo
                const benBankSwiftCode = beneficiaryBank.swiftCode
                const benBankClearingCode = beneficiaryBank.clearingCode
                const benBankName = beneficiaryBank.name
                const benBankAddress = beneficiaryBank.address
                const benBankCity = beneficiaryBank.city
                const benBankPaymentType = beneficiaryBank.paymentType
                const benBankPermitNo = beneficiaryBank.permitNo
                console.log('html maker called, ',  isDebit, isCash, isCheque, branch, date, isShared, isRemitter, isBeneficiary, isKyc, accountNo, passportNo, serialNo, fundSource, amountInWords, transferCurrency, orderingCustomer, beneficiaryCustomer, beneficiaryBank )
                const filePath = path.join(path.resolve(), '/assets/template/template.hbs')

                const html = await fs.readFileSync(filePath, "utf-8")
                
                const compiledTemplate = hbs.compile(html)({isDebit, isCash, isCheque, branch, date, isShared, isRemitter, isBeneficiary, isKyc, accountNo, passportNo, serialNo, fundSource, amountInWords, transferCurrency, ordCustName, ordCustAddress, 
                                                            ordCustCity, benCustName, benCustAddress, benCustCity, benBankAccountNo, benBankSwiftCode, benBankAddress, benBankClearingCode, benBankName, benBankCity, benBankPaymentType, benBankPermitNo})
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