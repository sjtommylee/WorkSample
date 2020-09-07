import React, { Component } from "react";
import DetailsCard from "./DetailsCard";
import StatusLog from "./StatusLog";
import { withRouter } from "react-router-dom";
import debug from "../../checkout/Code/node_modules/airpals-debug";
import PropType from "prop-types";
import * as orderService from "../../services/orderService";
import * as dateService from "../../services/dateService";
const logger = debug.extend("OrderDetails");
import "./detailscard.css";

class OrderDetails extends Component {
  state = {
    data: {
      chargeId: "",
      dateCreated: "",
      dropOff: {},
      dropOffId: "",
      id: "",
      messenger: {},
      messengerId: "",
      paymentAccountId: "",
      pickUp: {},
      statusId: "",
      trackingCode: "",
      trackingUrl: "",
      pickUpDate: "",
      dropOffDate: "",
      statusLog: null,
    },
  };
  componentDidMount() {
    if (!this.props.match.params.id) {
      this.setState(() => {
        return {
          data: this.props.location.state,
        };
      });
    } else {
      orderService
        .getById(this.props.match.params.id)
        .then(this.onGetByIdSuccess)
        .catch(this.onGetByIdError);
    }
  }

  onGetByIdSuccess = (response) => {
    let data = response.item;
    logger(data);
    this.setState((prevState) => {
      return { ...prevState, data: response.item };
    });
    logger(data.dropOffDate, data.pickUpDate);
  };
  onGetByIdError = (error) => {
    logger(error);
  };

  backHandler = () => {
    this.props.history.goBack();
  };

  orderPageHandler = () => {
    this.props.history.push("/orders");
  };

  render() {
    return (
      <div className="content-wrapper">
        <div className="content-heading">
          <h1>Order #{this.props.match.params.id || this.state.data.id} </h1>
          <div className="details-heading-header"></div>
        </div>
        <div className="pagenaviation-container">
          <button onClick={this.backHandler} className="btn btn-primary">
            <i className="fa fa-arrow-left" aria-hidden="true"></i>
          </button>
        </div>
        <div className="row">
          <DetailsCard
            data={this.props.location.state || this.state.data}
            backHandler={this.backHandler}
            className="content-primary"
          />
          <div className="content-secondary col-xl-6">
            <div className="status-title-block">
              <h4
                onClick={this.orderPageHandler}
                className="status-header-title"
              >
                TRACK ANOTHER ORDER{" "}
              </h4>
              {/* <p>{dateService.formatDateTime(this.state.data.dropOffDate)}</p> */}
              <div className="status-icon-container">
                <div>
                  <em className="fa-2x mr-2 far fa-star" />
                  <em className="fa-2x mr-2 far fa-question-circle" />
                </div>
              </div>
            </div>
            <div className="status-pickup-dropoff">
              <div className="status-pickup-datetime">
                <h4 className="status-subheader-title">Shipped on</h4>
                <p>{dateService.formatDateTime(this.state.data.pickUpDate)}</p>
              </div>
              <br />
              <div className="status-dropoff-datetime">
                <h4 className="status-subheader-title">Delivered on</h4>
                <p>{dateService.formatDateTime(this.state.data.dropOffDate)}</p>
              </div>
              <br />
            </div>
            {this.state.data.statusLog && <StatusLog statusLog={this.state.data.statusLog} size="medium"/>}
          </div>
        </div>
      </div>
    );
  }
}

OrderDetails.propTypes = {
  history: PropType.shape({
    goBack: PropType.func.required,
    push: PropType.func.required,
  }),
  match: PropType.shape({
    params: PropType.number.required,
  }),
  location: PropType.shape({
    state: PropType.shape({
      id: PropType.number.required,
      statusId: PropType.number.required,
      trackingCode: PropType.string.required,
      trackingUrl: PropType.string.required,
      dateCreated: PropType.string.required,
      chargeId: PropType.string.required,
      paymentAccountId: PropType.string.required,
      messengerId: PropType.number.required,
      createdBy: PropType.string.required,
      dateModified: PropType.string.required,
      modifiedBy: PropType.string.required,
      shipmentId: PropType.number.required,
      dropOffId: PropType.number.required,
      dropOff: PropType.shape({
        Contact: PropType.shape({
          FirstName: PropType.string.required,
          LastName: PropType.string.required,
          Email: PropType.string.required,
          Phone: PropType.string.required,
        }),
        ShippingAddress: PropType.shape({
          LineOne: PropType.string.required,
          LineTwo: PropType.string.required,
          City: PropType.string.required,
          State: PropType.string.required,
          Zip: PropType.string.required,
        }),
      }),

      messenger: PropType.shape({
        FirstName: PropType.string.required,
        LastName: PropType.string.required,
        AvatarUrl: PropType.string.required,
        Phone: PropType.string.required,
        IsActive: PropType.bool.required,
      }),
      pickUp: PropType.shape({
        Firstname: PropType.string.required,
        LastName: PropType.string.required,
        Email: PropType.string.required,
        Phone: PropType.string.required,
        Location: PropType.shape({
          LineOne: PropType.string.required,
          LineTwo: PropType.string.required,
          City: PropType.string.required,
          State: PropType.string.required,
          Zip: PropType.string.required,
        }),
      }),
    }),
  }),
};
React.memo;
export default withRouter(OrderDetails);
