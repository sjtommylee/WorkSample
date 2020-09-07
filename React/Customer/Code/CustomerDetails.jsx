import React from "react";
import PropTypes from "prop-types";
import * as dateService from "../../services/dateService";
import logger from "../../checkout/Code/node_modules/airpals-debug";
import * as customerService from "../../services/customerService";
import * as orderService from "../../services/orderService";
import * as stripeService from "../../services/stripeService";
// import { Modal, ModalFooter, ModalHeader } from "reactstrap";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import Pagination from "rc-pagination";
import PaymentHead from "./PaymentHead";
import PaymentRow from "./PaymentRow";
import "rc-pagination/assets/index.css";
import "./table.css";
import "./customer.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
class CustomerDetails extends React.Component {
  state = {
    customer: this.props.location.state,
    isOpen: false,
    orders: [],
    transactions: [],
    pageIndex: 0,
    pageSize: 3,
    currentPage: 1,
    transactionCurrentPage: 1,
    totalPages: 0,
    totalCount: 0,
  };
  componentDidMount() {
    if (!this.props.match.params.id) {
      this.setState(() => {
        return {
          customer: this.props.location.state,
        };
      });
    } else {
      customerService
        .getById(this.props.match.params.id)
        .then(this.onGetByIdSuccess)
        .catch(this.onGetByIdError);
    }
    orderService
      .getAllByCreatedBy(
        this.props.match.params.id,
        this.state.pageIndex,
        this.state.pageSize
      )
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);

    stripeService
      .getAllBySenderId(
        this.state.pageIndex,
        this.state.pageSize,
        this.props.match.params.id
      )
      .then(this.onGetTransactionSuccess)
      .catch(this.onGetTransactionError);
  }

  onGetTransactionSuccess = (response) => {
    logger("111111111111111111111111111", response);
    const {
      item: { pageIndex, totalCount, pagedItems: transactions },
    } = response;
    let mappedTransactions = transactions.map(this.mapTransactions);
    this.setState((prevState) => {
      return {
        ...prevState,
        mappedTransactions,
        transactionIndex: pageIndex,
        transactionCount: totalCount,
      };
    });
  };
  onGetTransactionError = (error) => {
    logger("2222222222222222222222222222", error);
  };

  getOrders = (page) => {
    orderService
      .getAllByCreatedBy(
        this.props.match.params.id,
        page - 1,
        this.state.pageSize
      )
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
  };
  getTransactions = (page) => {
    stripeService
      .getAllBySenderId(
        page - 1,
        this.state.pageSize,
        this.props.match.params.id
      )
      .then(this.onGetTransactionSuccess)
      .catch(this.onGetTransactionError);
  };

  onChange = (page) => {
    this.setState(
      {
        currentPage: page,
      },
      () => this.handleSearch()
    );
  };

  onTransactionChange = (page) => {
    this.setState(
      {
        transactionCurrent: page,
      },
      () => this.handleTransactionSearch()
    );
  };

  handleSearch = () => {
    orderService
      .getAllByCreatedBy(
        this.props.match.params.id,
        this.state.currentPage - 1,
        this.state.pageSize
      )
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
  };

  handleTransactionSearch = () => {
    stripeService
      .getAllBySenderId(
        this.state.transactionCurrent - 1,
        this.state.pageSize,
        this.props.match.params.id
      )
      .then(this.onGetTransactionSuccess)
      .catch(this.onGetTransactionError);
  };

  onGetAllSuccess = (response) => {
    const {
      item: { pageIndex, totalCount, pagedItems: orders },
    } = response;
    let mappedOrders = orders.map(this.mappedOrders);
    this.setState((prevState) => {
      return { ...prevState, mappedOrders, totalCount, pageIndex };
    });
  };
  onGetAllError = (error) => {
    logger(error);
  };

  onGetByIdSuccess = (response) => {
    let data = response.item;
    this.setState((prevState) => {
      return { ...prevState, customer: data };
    });
  };

  onGetByIdError = (error) => {
    logger(error);
  };

  viewMore = () => {
    logger("View more clicked");
  };
  mappedOrders = (order) => (
    <TableRow order={order} key={order.id} viewMore={this.viewMore} />
  );

  mapTransactions = (payment) => (
    <PaymentRow payment={payment} key={payment.id} viewMore={this.viewMore} />
  );

  render() {
    return (
      <div className="content-wrapper">
        <div className="row details-card">
          <div className="col-lg-4 text-center">
            <div className="card card-default">
              <div className="card-body text-center">
                <div className="status">
                  {this.state.customer.isActive ? (
                    <button
                      className="btn-oval btn btn-success"
                      onClick={this.customer}
                    >
                      Active
                    </button>
                  ) : (
                    <button
                      className="btn-oval btn btn-danger"
                      onClick={this.customer}
                    >
                      Not Active
                    </button>
                  )}
                </div>
                <div className="py-4">
                  <img
                    className="messenger-img img-fluid img-thumbnail"
                    src={
                      this.state.customer.avatarUrl
                        ? this.state.customer.avatarUrl
                        : "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/girl_avatar_child_kid-512.png"
                    }
                    alt="profile image"
                  />
                </div>
                <h3 className="m-0 text-bold messenger-more-details">
                  {this.state.customer.firstName} {this.state.customer.mi}{" "}
                  {this.state.customer.lastName}
                </h3>
              </div>
              <div className="messenger-background-status">
                <div className="messenger-details-title">
                  <div className="row rating-icon">
                    <em
                      id="rating-icon"
                      className="fa fa-star fa-fw"
                      aria-hidden="true"
                    />
                    <em
                      id="rating-icon"
                      className="fa fa-star fa-fw"
                      aria-hidden="true"
                    />
                    <em
                      id="rating-icon"
                      className="fa fa-star fa-fw"
                      aria-hidden="true"
                    />
                    <em
                      id="rating-icon"
                      className="fa fa-star fa-fw"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
              <table className="table table-bordered messenger-table-details">
                <tbody>
                  <tr>
                    <td className="messenger-details-title">
                      <strong>Member Since:</strong>
                    </td>
                    <td>
                      {dateService.formatDate(this.state.customer.dateCreated)}
                    </td>
                  </tr>
                  <tr>
                    <td className="messenger-details-title">
                      <strong>Company:</strong>
                    </td>
                    <td>
                      <strong>Golden Goose</strong>
                    </td>
                    {/* <td>
                      {this.state.customer.isBusinessAccount ? (
                        <span className="badge badge-success">True</span>
                      ) : (
                        <span className="badge badge-danger">False</span>
                      )}
                    </td> */}
                  </tr>
                  <tr>
                    <td className="messenger-details-title">
                      <strong>Address:</strong>
                    </td>
                    <td>{this.state.address}</td>
                  </tr>
                  <tr>
                    <td className="messenger-details-title">
                      <strong>Phone:</strong>
                    </td>
                    <td>{this.state.customer.phone}</td>
                  </tr>

                  <tr>
                    <td className="messenger-details-title">
                      <strong>Email:</strong>
                    </td>
                    <td>{this.state.customer.email}</td>
                  </tr>
                  <tr>
                    <td className="messenger-details-title">
                      <strong>Notes:</strong>
                    </td>
                    <td>{this.state.address}</td>
                  </tr>
                </tbody>
              </table>
              <div
                className="text-center send-message-btn"
                style={{ "padding-top": "40px" }}
              >
                <button
                  type="button"
                  className="btn btn-primary main-card-footer"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="col-lg-13 text-center">
                <div className="card-default card">
                  <h3 className="card-header messenger-more-details">
                    Transaction History
                  </h3>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <PaymentHead />
                      </thead>
                      <tbody>{this.state.mappedTransactions}</tbody>
                    </table>
                  </div>
                  <div className="card-footer">
                    <div>
                      <div>
                        <div className="pagination-container">
                          <Pagination
                            total={this.state.transactionCount}
                            current={this.state.transactionCurrent}
                            pageSize={this.state.pageSize}
                            onChange={this.onTransactionChange}
                            locale={localeInfo}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-13 text-center">
                <div className="card-default card">
                  <h3 className="card-header messenger-more-details">
                    Order History
                  </h3>
                  <table
                    className="table table-striped table-hover b0 dataTable no-footer dtr-inline collapsed"
                    id="DataTables_Table_1"
                    role="grid"
                    aria-describedby="DataTables_Table_1_info"
                  >
                    <TableHead />

                    <tbody>{this.state.mappedOrders}</tbody>
                  </table>
                  <div className="card-footer">
                    <div>
                      <div>
                        <div className="pagination-container">
                          <Pagination
                            total={this.state.totalCount}
                            current={this.state.currentPage}
                            pageSize={this.state.pageSize}
                            onChange={this.onChange}
                            locale={localeInfo}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 text-center"></div>
          </div>
        </div>
      </div>
    );
  }
}

CustomerDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.number.required,
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      id: PropTypes.number.required,
      statusId: PropTypes.number.required,
      trackingCode: PropTypes.string.required,
      trackingUrl: PropTypes.string.required,
      dateCreated: PropTypes.string.required,
      chargeId: PropTypes.string.required,
      paymentAccountId: PropTypes.string.required,
      messengerId: PropTypes.number.required,
      createdBy: PropTypes.string.required,
      dateModified: PropTypes.string.required,
      modifiedBy: PropTypes.string.required,
      shipmentId: PropTypes.number.required,
      dropOffId: PropTypes.number.required,
      dropOff: PropTypes.shape({
        Contact: PropTypes.shape({
          FirstName: PropTypes.string.required,
          LastName: PropTypes.string.required,
          Email: PropTypes.string.required,
          Phone: PropTypes.string.required,
        }),
        ShippingAddress: PropTypes.shape({
          LineOne: PropTypes.string.required,
          LineTwo: PropTypes.string.required,
          City: PropTypes.string.required,
          State: PropTypes.string.required,
          Zip: PropTypes.string.required,
        }),
      }),

      messenger: PropTypes.shape({
        FirstName: PropTypes.string.required,
        LastName: PropTypes.string.required,
        AvatarUrl: PropTypes.string.required,
        Phone: PropTypes.string.required,
        IsActive: PropTypes.bool.required,
      }),
      pickUp: PropTypes.shape({
        Firstname: PropTypes.string.required,
        LastName: PropTypes.string.required,
        Email: PropTypes.string.required,
        Phone: PropTypes.string.required,
        Location: PropTypes.shape({
          LineOne: PropTypes.string.required,
          LineTwo: PropTypes.string.required,
          City: PropTypes.string.required,
          State: PropTypes.string.required,
          Zip: PropTypes.string.required,
        }),
      }),
    }),
  }),
};

export default CustomerDetails;
