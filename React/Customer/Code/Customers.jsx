import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import * as customerService from "../../services/customerService";
import logger from "../../checkout/Code/node_modules/airpals-debug";
import { Row } from "reactstrap";
import PropTypes from "prop-types";
import "./customer.css";
import CustomerCard from "./CustomerCard";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";

class Customers extends Component {
  state = {
    customers: [],
    current: 1,
    pageIndex: 0,
    pageSize: 12,
    totalPages: 0,
    totalCount: 0,
    query: "",
  };
  componentDidMount() {
    this.getAll(1);
  }

  getAll = (page) => {
    customerService
      .getAll(page - 1, this.state.pageSize)
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
  };

  onChange = (page) => {
    this.setState(
      () => {
        this.getAll(page);
      },
      (prevState) => {
        return { ...prevState, current: page };
      }
    );
  };
  onGetAllSuccess = (response) => {
    const {
      item: { pageSize, pageIndex, totalCount, pagedItems: customers },
    } = response;
    let mappedCustomers = customers.map(this.mapCustomers);
    this.setState(
      (prevState) => {
        return {
          ...prevState,
          customers,
          pageIndex,
          pageSize,
          totalCount,
          mappedCustomers,
        };
      },
      () => logger("11111111111111111111111111", this.state)
    );
  };
  onGetAllError = (error) => {
    logger(error);
  };
  viewMore = (customer) => {
    this.props.history.push(`/customer/details/${customer.userId}`, customer);
  };

  getQuery = (e) => {
    const {
      target: { name, value },
    } = e;
    this.setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  switchPageSize = () => {
    this.setState(() => {
      if (this.state.pageSize >= 10) {
        this.getAll(1);
      }
    });
  };

  searchCustomers = () => {
    this.setState(() => {
      if (this.state.query.length > 0) {
        customerService
          .searchCustomer(0, this.state.pageSize, this.state.query)
          .then(this.onGetAllSuccess)
          .catch(this.onGetAllError);
      } else {
        this.getAll(1);
      }
    });
  };

  enterPressed = (e) => {
    const code = e.keyCode || e.which;
    if (code === 13) {
      this.setState(() => {
        if (this.state.query.length > 0) {
          customerService
            .searchCustomer(0, this.state.pageSize, this.state.query)
            .then(this.onGetAllSuccess)
            .catch(this.onGetAllError);
        } else {
          this.getAll(1);
        }
      });
    }
  };

  mapCustomers = (customer) => (
    <CustomerCard
      customer={customer}
      key={customer.id}
      viewMore={this.viewMore}
    />
  );
  render() {
    return (
      <div className="content-wrapper">
        <h1 className="page-header">Customers</h1>
        <div className="row" style={{ marginBottom: "30px" }}>
          <div className="input-group page-size col-md-7">
            <div>
              <select
                className="form-control"
                name="pageSize"
                value={this.state.pageSize}
                onChange={this.getQuery}
                onClick={this.switchPageSize}
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>

          <div className="input-group search-bar col-md-4">
            <input
              className="form-control"
              type="text"
              placeholder="Search..."
              name="query"
              value={this.state.query}
              onChange={this.getQuery}
              onKeyPress={this.enterPressed}
            />
            <span className="input-group-btn">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={this.searchCustomers}
              >
                <em className="fa fa-search" />
              </button>
            </span>
          </div>
        </div>
        <Row id="messenger-card-row">{this.state.mappedCustomers}</Row>
        <Pagination
          className="pagination"
          total={this.state.totalCount}
          current={this.state.currentPage}
          pageSize={this.state.pageSize}
          onChange={this.onChange}
          locale={localeInfo}
        ></Pagination>
      </div>
    );
  }
}
Customers.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.required,
  }),
};
export default withRouter(Customers);
