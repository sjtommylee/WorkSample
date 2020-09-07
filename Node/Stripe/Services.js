const debug = require("airpals-debug");
const chalk = require("chalk");
const {dataProvider, TYPES} = require("airpals-data");
const logger = debug.extend("StripeService.js");
const {Paged} = require("airpals-models");
const { sendPaymentConfirmationEmail } = require("./EmailService");

class StripeService {
    ping() {
        _logger('ping from StripeService.js')
        return dataProvider.ping()
        .then(internalSuccess)
        .catch(internalCatch)
    }  
    
    insertTransaction(requestObject, recipientAccountId, recipientId) {
        return new Promise(executor);
        function executor(resolve, reject) {
            const procName = 'dbo.PaymentTransactions_Insert'
            let transactionId = null;
            dataProvider.executeNonQuery(procName, inputParamMapper, returnParamMapper, onCompleted)
            function inputParamMapper(request) {
                request.output('Id', TYPES.Int)
				request.input('RecipientAccountId', TYPES.NVarChar, recipientAccountId)
				request.input('SenderAccountId' , TYPES.NVarChar, requestObject.senderAccountId)
				request.input('RecipientId', TYPES.Int, recipientId)
				request.input('SenderId', TYPES.Int, requestObject.senderId)
				request.input('Amount', TYPES.Decimal, requestObject.amount)
				request.input('TransactionToken', TYPES.NVarChar, requestObject.transactionToken)
            }
            function returnParamMapper(returnParams) {
                transactionId = returnParams.id
            }
            function onCompleted(error, data) {
                sendPaymentConfirmationEmail(requestObject.amount / 100)
                if(error) {
                    reject(error)
                    return;
                }
                resolve(transactionId)
            }

        }
        
    }

    getAllBySenderId(pageIndex, pageSize, senderId ) {
        return new Promise(executor)
        function executor(resolve, reject) {
            let payments = [];
            let totalCount = null;
            let totalPages = null;
            const procName = 'dbo.PaymentTransactions_Select_BySenderId'
            const returnParamMapper = null;
            dataProvider.executeCmd(procName, inputParamMapper, singleRecordMapper, returnParamMapper, onCompleted)
            function inputParamMapper(request) {
                request.input('pageIndex', TYPES.Int, pageIndex)
                request.input('pageSize', TYPES.Int, pageSize)
                request.input('SenderId', TYPES.Int, senderId)
            }
            function singleRecordMapper(data) {
                if(!payments) {
                    payments = [];
                } totalCount = data.totalCount;
                delete data.totalCount;
                payments.push(data)
            }
            function onCompleted(error) {
                if(error) {
                    reject(error)
                    return;
                }
                if(payments) {
                    totalPages = new Paged(payments, pageIndex, pageSize, totalCount)
                    logger('2222222222222222222222222', payments)
                    totalPages.pagedItems.forEach((item) => {
                        item.sender = JSON.parse(item.sender)
                    })
                    
                }
                resolve(totalPages)
            }
        }
    }
}

function internalSuccess(...args) {
    _logger(chalk.green.bold("Internal Success" + args));
}

function internalCatch(error) {
    _logger(chalk.red.bold("Internal Catch" + error));
}

const service = new StripeService();

module.exports = service
