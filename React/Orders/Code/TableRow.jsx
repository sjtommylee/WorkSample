import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import PropType from "prop-types";
import * as dateService from "../../services/dateService";
import "./table.css";

const TableRow = ({ order, deleteHandler, editHandler, viewHandler }) => {
  const handleEdit = () => {
    editHandler(order);
  };
  const handleDelete = () => {
    deleteHandler(order.id);
  };

  const viewDetails = () => {
    viewHandler(order);
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const setStatusId = (statusId) => {
    switch (statusId) {
      case 1:
        return <span className="badge badge-warning">Pending</span>;
      case 2:
        return <span className="badge badge-warning">Open</span>;
      case 3:
        return <span className="badge badge-info">In Transit</span>;
      case 4:
        return <span className="badge badge-info">Picked up</span>;
      case 5:
        return <span className="badge badge-purple">Delivered</span>;
      case 6:
        return <span className="badge badge-success">Completed</span>;
      case 7:
        return <span className="badge badge-danger">Cancelled</span>;
      case 8:
        return <span className="badge badge-inverse">Draft</span>;
      case 9:
        return <span className="badge badge-danger">Disputed</span>;
    }
  };

  return (
    <>
      <tr role="row" className="table-row-row">
        <td id="tb-td-id" className="tb-td-id">
          {order ? order.id : ""}
        </td>
        <td className="tb-header-th">
          <span className="">{setStatusId(order ? order.statusId : "")}</span>
        </td>
        <td className="tb-header-th">
          <img
            className="tb-messenger-img img-fluid circle"
            src={
              order.messenger
                ? order.messenger.AvatarUrl
                : "https://www.pngitem.com/pimgs/m/421-4212341_default-avatar-svg-hd-png-download.png"
            }
            alt="profile image"
          />
        </td>
        <td className="tb-header-th">{order ? order.trackingCode : ""}</td>
        <td className="tb-header-th">{order ? order.trackingUrl : ""}</td>
        <td className="tb-header-th">{order ? order.chargeId : ""}</td>
        <td className="tb-header-th">{order ? order.paymentAccountId : ""}</td>
        <td className="tb-header-th">
          {dateService.formatDateTime(order ? order.dateCreated : "")}
        </td>
        <td className="tb-header-th">
          <Dropdown aria-disabled="true" isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle className="tb-dropdown-btn">
              <i
                id="tb-dropdown"
                className="fa fa-ellipsis-h"
                aria-hidden="true"
              />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                id="view-details-drop-btn"
                className="tb-dropdown-item"
              >
                <i className="fa fa-info-circle"></i>
                <div onClick={viewDetails} className="tb-dropdown-txt">
                  View Details
                </div>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleEdit} className="tb-dropdown-item">
                <i className="far fa-edit"></i>
                <div className="tb-dropdown-txt">Edit</div>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleDelete} className="tb-dropdown-item">
                <i className="far fa-trash-alt"></i>
                <div className="tb-dropdown-txt">Delete</div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </td>
      </tr>
      <tr className="tr-spacer" />
    </>
  );
};
TableRow.propTypes = {
  deleteHandler: PropType.func,
  editHandler: PropType.func,
  handleEdit: PropType.func,
  viewHandler: PropType.func.isRequired,
  order: PropType.shape({
    id: PropType.number.required,
    statusId: PropType.number.required,
    trackingCode: PropType.string.required,
    trackingUrl: PropType.string.required,
    dateCreated: PropType.string.required,
    chargeId: PropType.string.required,
    paymentAccountId: PropType.string.required,
    messengerId: PropType.number.required,
    messenger: PropType.shape({
      FirstName: PropType.string.required,
      LastName: PropType.string.required,
      AvatarUrl: PropType.string.required,
      Phone: PropType.string.required,
      IsActive: PropType.bool.required,
    }),
  }),
};
React.memo;
export default TableRow;
