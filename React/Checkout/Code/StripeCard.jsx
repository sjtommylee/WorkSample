
import React, { useState, useEffect } from "./node_modules/react";
import { loadStripe } from "./node_modules/@stripe/stripe-js";
import {
  CardElement,
  Elements,
  ElementsConsumer,
} from "./node_modules/@stripe/react-stripe-js";
import logger from "./node_modules/airpals-debug";
import { toast } from "./node_modules/react-toastify";
import "./stripe.scss";
import * as stripeService from "../../services/stripeService";
import * as serviceHelpers from "../../services/serviceHelpers";
import * as shipmentService from "../../services/shipmentService";
import * as orderService from "../../services/orderService";
import Swal from "./node_modules/sweetalert";
import pickupOptions from "../../schemas/pickupOptions";

const _logger = logger.extend("StripeCard");
_logger("from stripe card");

const CardField = ({ onChange }) => (
  <div className="form-row-group">
    <CardElement onChange={onChange} />
  </div>
);
const Field = ({
  label,
  id,
  type,
  placeholder,
  required,
  autoComplete,
  value,
  onChange,
}) => (
  <div className="form-row-group">
    <label htmlFor={id} className="form-row-label">
      {label}
    </label>
    <input
      className="form-control"
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
    />
  </div>
);

const SubmitButton = ({ processing, error, children, disabled }) => (
  <button
    className={`submit-btn ${error ? "submit-btn--error" : ""}`}
    type="submit"
    disabled={processing || disabled}
  >
    {processing ? "Processing..." : children}
  </button>
);

const ErrorMessage = ({ children }) => (
  <div className="form-error-message" role="alert">
    <svg width="16" height="16" viewBox="0 0 17 17">
      <path
        fill="#FFF"
        d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
      />
      <path
        fill="#6772e5"
        d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
      />
    </svg>
    {children}
  </div>
);

const StripeCard = (props) => {
  const { stripe, elements } = props;
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [billingDetails, setBillingDetails] = useState({
    name: "",
  });
  useEffect(() => {
    stripeService
      .paymentIntent({ amount: props.shipmentTotal * 100 })
      .then((data) => {
        setClientSecret(data.item);
      })
      .catch(checkoutError);
  }, []);


  const checkoutError = (error) => {
    logger(error);
  };

  const handleOrderTransaction = (data) => {
    addShipment(data);
  };

  const addShipment = (data) => {
    logger(pickupOptions);
    const payload = {
      ...props.shipmentData,
      data,
    };

    shipmentService
      .add(payload)
      .then((response) => onAddShipmentSuccess(data, response))
      .catch(onAddShipmentError);
  };

  const onAddShipmentSuccess = (data, response) => {
    let id = response.item;
    logger("00000000000000000000000000000000000000", id);
    insertOrderTransaction(id, data);
  };

  const onAddShipmentError = (error) => {
    logger("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", error);
  };

  const insertOrderTransaction = (id, data) => {
    const payload = {
      shipmentId: id,
      statusId: 1,
      trackingCode: "TESTESSSS-123",
      trackingUrl: "TESTSTESTSET-123",
      chargeId: "SETESTSTSTSTSTST-123IHATE",
      senderAccountId: clientSecret,
      senderId: props.shipmentData.customerId,
      amount: props.shipmentData.total,
      transactionToken: data,
    };

    orderService
      .insertOrderTransaction(payload)
      .then(() => logger("1111111111111111111111111", payload))
      .then(onInsertOrderTransactionSuccess)
      .catch(onInsertOrderTransactionError);
  };

  const onInsertOrderTransactionSuccess = () => {
    Swal({
      icon: "success",
      title: "Success!",
      text: "Payment successful",
      timer: 2000,
      button: false,
    });
  };

  const onInsertOrderTransactionError = (error) => {
    logger(error);
    toast.error("2222222222222222222222222222", error.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    if (error) {
      elements.getElement("card").focus();
      return;
    }
    if (cardComplete) {
      setProcessing(true);
    }
    const paymentMethodReq = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: billingDetails,
    });
    if (paymentMethodReq.error) {
      setError(paymentMethodReq.error);
      setProcessing(false);
    } else {
      setPaymentMethod(paymentMethodReq);
    }
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodReq.paymentMethod.id,
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      let data = {
        senderAccountId: clientSecret,
        senderId: props.shipmentData.customerId,
        amount: props.shipmentData.total * 100,
        transactionToken: paymentMethodReq.paymentMethod.id,
      };

      handleOrderTransaction(data.transactionToken);
    }
  };

  return paymentMethod ? (
    <div className="payment-form-container-main">
      <div className="success-screen">
        <h4>Thank you for choosing airpals</h4>
        <br />
        <h4>Click here to redirect to the main page</h4>
      </div>
    </div>
  ) : (
    <div className="payment-form-container-main">
      <form className="payment-form" onSubmit={handleSubmit}>
        <fieldset className="payment-formgroup">
          <Field
            label="Card Holder Name"
            id="name"
            type="text"
            placeholder="Name"
            required
            autoComplete="name"
            value={billingDetails.name}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, name: e.target.value });
            }}
          />
        </fieldset>
        <fieldset className="payment-formgroup">
          <CardField
            onChange={(e) => {
              setError(e.error);
              setCardComplete(e.complete);
            }}
          />
        </fieldset>
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
        <SubmitButton processing={processing} error={error} disabled={!stripe}>
          Pay Now
        </SubmitButton>
      </form>
    </div>
  );
};

const ELEMENTS_OPTIONS = {
  fonts: [
    {
      cssSrc: "https://fonts.googleapis.com/css?family=Roboto",
    },
  ],
};

const stripePromise = loadStripe(serviceHelpers.STRIPE_APIKEY);

const StripeCheckout = (props) => {
  return (
    <div className="payment-form-container">
      <div className="payment-form-wrapper">
        <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
          <ElementsConsumer>
            {({ elements, stripe }) => (
              <StripeCard
                {...props}
                elements={elements}
                stripe={stripe}
                shipmentData={props.shipmentData}
              />
            )}
          </ElementsConsumer>
        </Elements>
      </div>
    </div>
  );
};

React.Memo;
export default StripeCheckout;
