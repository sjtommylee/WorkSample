import React, { Component } from "react";
import * as paymentService from "../../services/paymentAccountService";
import schemas from "../../schemas/paymentSchema";
import { Formik, Form, Field } from "formik";
import "./paymentform.css";
import debug from "airpals-debug";
const logger = debug.extend("PaymentForm");
class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: "",
      accountId: "",
      paymentTypeId: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  submitButtonClickHandler = () => {
    logger("submit clicked");
  };

  handleSubmit = (values) => {
    let data = { ...values };
    logger(data);
    paymentService
      .insertAccount(data)
      .then(this.onInsertSuccess)
      .catch(this.onInsertError);
  };

  onInsertSuccess = (response) => {
    logger(response);
  };
  onInsertError = (error) => {
    logger(error);
  };

  render() {
    return (
      <>
        <Formik
          enableReinitialize={true}
          initialValues={this.state}
          onSubmit={this.handleSubmit}
          validationSchema={schemas.basePaymentSchema}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleSubmit,
              handleBlur,
              handleChange,
            } = props;
            return (
              <Form onSubmit={handleSubmit} className="row">
                <div className="col-md-6">
                  <div className="card-default card">
                    <div className="card-header">Payment Form</div>
                    <div className="card-body">
                      <div className="position-relative form-group">
                        <label>Customer Id</label>
                        <Field
                          placeholder="Customer Id"
                          type="text"
                          name="customerId"
                          values={values.customerId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.customerId && touched.customerId
                              ? "form-control error"
                              : "form-control"
                          }
                        />
                        {errors.customerId && touched.customerId && (
                          <div className="input-feedback">
                            {errors.customerId}
                          </div>
                        )}
                      </div>
                      <div className="position-relative form-group">
                        <label>Account Id</label>
                        <Field
                          placeholder="Account Id"
                          type="text"
                          name="accountId"
                          values={values.accountId}
                          onChange={handleChange}
                          className={
                            errors.accountId && touched.accountId
                              ? "form-control error"
                              : "form-control"
                          }
                        />
                        {errors.accountId && touched.accountId && (
                          <div className="input-feedback">
                            {errors.accountId}
                          </div>
                        )}
                      </div>
                      <label>Payment Type Id</label>
                      <Field
                        placeholder="Payment Type Id"
                        type="text"
                        name="paymentTypeId"
                        values={values.paymentTypeId}
                        onChange={handleChange}
                        className={
                          errors.paymentTypeId && touched.paymentTypeId
                            ? "form-control error"
                            : "form-control"
                        }
                      />
                      {errors.paymentTypeId && touched.paymentTypeId && (
                        <div className="input-feedback">
                          {errors.paymentTypeId}
                        </div>
                      )}
                      <div className="button-container">
                        <button
                          className="btn btn-sm btn-secondary"
                          type="submit"
                          onClick={this.handleSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </>
    );
  }
}

export default PaymentForm;
