const Responses = require("airpals-web-models").Responses;
const {RoutePrefix, Route} = require("airpals-routing");
const BaseController = require("./BaseController");
const stripeService = require('airpals-services').stripeService
const Stripe = require('stripe');
require('dotenv').config({path: './env'})
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const stripePk = process.env.STRIPE_PUBLIC_KEY


@RoutePrefix('/api/checkout')
class StripeController extends BaseController {
    constructor() {
        super('StripeController')
    }
    @Route("GET", "pk")
    getPk(req, res) {
        const response = new Responses.ItemResponse(pk)
        res.status(200).json(response)
    }
    @Route("POST", "charge")
    createPaymentIntent(req, res) {
        const {amount} = req.body;
        stripe.paymentIntents.create({
            amount,
            currency: "usd"
        })
        .then(responseObj => {
            const response = new Responses.ItemResponse(responseObj.client_secret)
            res.status(200).json(response)
        }).catch(error => {
            res.status(500).json(new Responses.ErrorResponse(error))
        })
    }

    @Route("POST", "record/transaction")
    insertTransaction(req, res) {
        const recipientAccountId = stripePk
        const recipientId = 1
        stripeService.insertTransaction(req.body, recipientAccountId, recipientId)
        .then(responseObj => {
            const response = new Responses.ItemResponse(responseObj)
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json(new Responses.ErrorResponse(error))
        })
    }
    @Route("GET", "record/transaction/:id(\\d+)")
    getAllBySenderId(req, res, next) {
        stripeService.getAllBySenderId(req.query.pageIndex, req.query.pageSize, req.params.id)
        .then(responseObject => {
            let response = null;
            let code = 200;
            if(responseObject) {
                response = new Responses.ItemResponse(responseObject)
            } else {
                code = 404;
                response = new Responses.ErrorResponse("Records not found")
            }
            res.status(code).json(response)
        }) 
        .catch(error => {
            res.status(500).json(new Responses.ErrorResponse(error))
        })
    }

    @Route("POST", "method")
    createPaymentMethod(req, res) {
        const paymentMethod = req.body;
        stripe.paymentMethods.create(
            paymentMethod
        )
        .then(responseObj => {
            const response = new Responses.ItemResponse(responseObj)
            res.status(200).json(response)
        }).catch(error => {
            res.status(500).json(new Responses.ErrorResponse(error))
        })
    }

    @Route("POST", "confirm")
    confirmPaymentMethod(req, res) {
        const {clientSecret, paymentMethod} = req.body;
        stripe.confirmCardPayment(
            clientSecret, 
            {
                paymentMethod: paymentMethod
            }
        )
        .then(responseObj => {
            const response = new Responses.ItemResponse(responseObj)
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json(new Responses.ErrorResponse(error))
        })
    }



    @Route("GET", "retrieve")
    retrieveCharge(req, res) {
        const {requestObject} = req.body;
        stripe.charges.retrieve(requestObject)
        .then(returnObject => {
            let response = null;
             let code = 200;
           if(returnObject) {
               response = new Responses.ItemResponse(returnObject)
           } else {
               code = 404;
               response = new Responses.ErrorResponse('records not found')
           }
           res.status(code).json(response)
        })
        .catch(error => {
            res.status(500).json(new Responses.ErrorResponse(error))
        })
    }

}

module.exports = {
    controller: StripeController
}