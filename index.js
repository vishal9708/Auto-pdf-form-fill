const express = require('express')
const fs = require('fs')
const { renderPdf } = require('./htmlmaker')
const app = express()
app.use(express.json())

app.get('/healthCheck', async(req, res) => {
    res.status(200).send('Connected')
})

app.post('/renderPdf', async(req, res) => {
    try {
        console.log('renderPdf api called')
        const { isDebit, isCash, isCheque, branch, date, isShared, isRemitter, isBeneficiary, isKyc, accountNo, passportNo, serialNo, fundSource, amountInWords, transferCurrency, orderingCustomer, beneficiaryCustomer, beneficiaryBank } = req.body
        const pdf = await renderPdf(isDebit, isCash, isCheque, branch, date, isShared, isRemitter, isBeneficiary, isKyc, accountNo, passportNo, serialNo, fundSource, amountInWords, transferCurrency, orderingCustomer, beneficiaryCustomer, beneficiaryBank)

        console.log('after pdfMaker')
        var file = fs.createReadStream('output.pdf');
        var stat = fs.statSync('output.pdf');
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
        return file.pipe(res);
    } catch (err) {
        const message = err.message ? err.message : 'something went wrong'
        res.status(400).send({success: false, message: message})
    }
})

app.listen(8080, console.log('running on port 8080'))