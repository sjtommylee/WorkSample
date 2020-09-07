import React, { Component } from "react";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";
import { withRouter } from "react-router-dom";
import Pagination from "rc-pagination";
import logger from "../../checkout/Code/node_modules/airpals-debug";
import PropType from "prop-types";
import "./order.css";
import * as orderService from "../../services/orderService";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
const _logger = logger.extend("OrderDataGrid");
class OrderDataGrid extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    data: [],
    mappedOrders: [],
    currentPage: 1,
    pageIndex: 0,
    pageSize: 10,
    total: 0,
    status: "",
  };

  componentDidMount() {

    if (this.props.currentUser.roles[0] === "Customer") {
      _logger("Customer Role......", { currentUser: this.props.currentUser })
      orderService.getAllByCreatedBy(this.props.currentUser.id, this.state.pageIndex, this.state.pageSize)
        .then(this.onGetAllSuccess)
        .catch(this.onGetAllError)
    } else {
      orderService
        .getAll(this.state.pageIndex, this.state.pageSize)
        .then(this.onGetAllSuccess)
        .catch(this.onGetAllError);
    }
  }
  onChange = (page) => {
    this.setState(
      {
        currentPage: page,
      },
      () => this.handleSearch()
    );
  };
  handleSearch = () => {
    if (this.state.status !== "" || undefined) {
      orderService
        .searchByStatusId(
          this.state.currentPage - 1,
          this.state.pageSize,
          this.state.status
        )
        .then(this.onGetAllSuccess)
        .catch(this.onGetAllError);
    } else if (this.props.currentUser.roles[0] === "Customer") {
      orderService.getAllByCreatedBy(this.props.currentUser.id, this.state.currentPage - 1, this.state.pageSize)
        .then(this.onGetAllSuccess)
        .catch(this.onGetAllError)

    } else {
      orderService
        .getAll(this.state.currentPage - 1, this.state.pageSize)
        .then(this.onGetAllSuccess)
        .catch(this.onGetAllError);
    }
  };

  handleSelect = (e) => {
    let value = e.target.value;
    this.setState((prevState) => {
      return { ...prevState, pageSize: value };
    });
  };

  handleStatusSelect = (e) => {
    let value = e.target.value;
    this.setState(
      (prevState) => {
        return { ...prevState, currentPage: 1, status: value };
      },
      () => this.handleSearch()
    );
  };

  onGetAllSuccess = (response) => {
    let data = response.item.pagedItems;
    let mappedOrders = data.map(this.mapOrders);
    let total = response.item.totalCount;
    let pageIndex = response.item.pageIndex;

    this.setState((prevState) => {
      return { ...prevState, mappedOrders, total, pageIndex };
    });
  };

  editHandler = (order) => {
    logger(order.id);
  };

  deleteHandler = () => {
    logger("delete handler clicked");
  };

  viewHandler = (order) => {
    this.props.history.push(`/orders/details/${order.id}`, order);
  };

  mapOrders = (order) => (
    <TableRow
      key={order.id}
      order={order}
      editHandler={this.editHandler}
      deleteHandler={this.deleteHandler}
      viewHandler={this.viewHandler}
    />
  );

  onGetAllError = (error) => {
    logger(error);
  };

  render() {
    return (
      <>
        <div className="rag-fadeIn-enter-done">
          <div className="content-wrapper">
            <div className="content-heading">Orders</div>
            <div
              id="DataTables_Table_1_wrapper"
              className="dataTables_wrapper dt-bootstrap4 no-footer"
            >
              <div id="table-header-pagenav-container" className="row">
                <div
                  id="table-dropdown-container"
                  className="col-sm-12 col-md-6"
                >
                  <div
                    className="dataTables_length"
                    id="DataTables_Table_1_length"
                  >
                    <label>
                      <select
                        name="DataTables_Table_1_length"
                        aria-controls="DataTables_Table_1"
                        className="custom-select custom-select-sm form-control form-control-sm"
                        onChange={this.handleSelect}
                      >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                      </select>{" "}
                      records per page
                    </label>
                  </div>
                </div>
                <div
                  id="table-dropdown-container"
                  className="col-sm-12 col-md-6"
                >
                  <div
                    className="dataTables_length"
                    id="DataTables_Table_1_length"
                  >
                    <label>
                      <select
                        name="DataTables_Table_1_length"
                        aria-controls="DataTables_Table_1"
                        className="custom-select custom-select-sm form-control form-control-sm"
                        onChange={this.handleStatusSelect}
                        id="order-status-dropdown"
                      >
                        <option value={""}>Status</option>
                        <option value={1}>Pending</option>
                        <option value={2}>Open</option>

                        <option value={3}>In Transit</option>
                        <option value={5}>Delivered</option>

                        <option value={6}>Completed</option>
                        <option value={7}>Cancelled</option>

                        <option value={9}>Disputed</option>
                      </select>{" "}
                      Filter by status
                    </label>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <table
                    className="table table-striped table-hover b0 dataTable no-footer dtr-inline collapsed"
                    id="DataTables_Table_1"
                    role="grid"
                    aria-describedby="DataTables_Table_1_info"
                  >
                    <TableHeader />
                    <tbody>{this.state.mappedOrders}</tbody>
                  </table>
                  <div className="pagination-container">
                    <Pagination
                      total={this.state.total}
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
        <div className="table-container">
          <table className="table">
            <tbody></tbody>
          </table>
        </div>
      </>
    );
  }
}

OrderDataGrid.propTypes = {
  history: PropType.shape({
    push: PropType.func.isRequired,
  }),
  currentUser: PropType.shape({
    id: PropType.number,
    avatarUrl: PropType.string,
    email: PropType.string,
    name: PropType.string,
    roles: PropType.arrayOf(PropType.string),
    isLogged: PropType.bool
  })
};
React.memo;
export default withRouter(OrderDataGrid);
