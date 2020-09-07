import React from "react";
import { withRouter } from "react-router-dom";
import PropType from "prop-types";
import "./detailscard.css";
import * as dateService from "../../services/dateService";

const DetailsCard = ({ data }) => {
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
      <div className="card-default card col-xl-6">
        <div className="card-header">Order Information</div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-6">
              <p className="lead bb">Order Details</p>
              <form className="form-horizontal">
                <div className="position-relative row form-group">
                  <div className="col-md-4">Order ID:</div>
                  <div className="col-md-8">
                    <strong>{data.id ? data.id : ""}</strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Order Status</div>
                  <div className="col-md-8">
                    <strong>{setStatusId(data.statusId)}</strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Tracking Code</div>
                  <div className="col-md-8">
                    <strong>
                      {data.trackingCode ? data.trackingCode : ""}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Tracking URL</div>
                  <div className="col-md-8">
                    <strong>{data.trackingUrl ? data.trackingUrl : ""}</strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Created On</div>
                  <div className="col-md-8">
                    <strong>
                      {dateService.formatDateTime(data.dateCreated)}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Order Total:</div>
                  <div className="col-md-8">
                    <strong>$30.00</strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Order Tip:</div>
                  <div className="col-md-8">
                    <strong>
                      $4.00
                    </strong>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-6">
              <p className="lead bb">Delivered By</p>
              <form className="form-horizontal">
                <div className="position-relative row form-group">
                  <div className="col-md-12">
                    <img
                      src={data.messenger ? data.messenger.AvatarUrl : ""}
                      style={{ height: "100px" }}
                    />
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Messenger ID:</div>
                  <div className="col-md-8">
                    <strong>{data.messengerId ? data.messengerId : ""}</strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Name:</div>
                  <div className="col-md-8">
                    <strong>
                      {data.messenger ? data.messenger.FirstName : ""} &nbsp;{" "}
                      {data.messenger ? data.messenger.LastName : ""}
                    </strong>
                  </div>
                </div>

                <div className="position-relative row form-group">
                  <div className="col-md-4">Phone:</div>
                  <div className="col-md-8">
                    <strong>
                      {data.messenger ? data.messenger.Phone : ""}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Current Status</div>
                  <div className="col-md-8">
                    <div>
                      {data.messenger ? (
                        data.messenger.IsActive ? (
                          <span className="badge badge-success">Active</span>
                        ) : (
                          <span className="badge badge-danger">Inactive</span>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <p className="lead bb">Billing Address</p>
              <form className="form-horizontal">
                <div className="position-relative row form-group">
                  <div className="col-md-4">First Name</div>
                  <div className="col-md-8">
                    <strong>{data.pickUp ? data.pickUp.Firstname : ""}</strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Last Name:</div>
                  <div className="col-md-8">
                    <strong>{data.pickUp ? data.pickUp.LastName : ""}</strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Email:</div>
                  <div className="col-md-8">
                    <strong>{data.pickUp ? data.pickUp.Email : ""}</strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Address:</div>
                  <div className="col-md-8">
                    <strong>{data.pickUp ? data.pickUp.LineOne : ""}</strong>
                    <br />
                    <strong>{data.pickUp ? data.pickUp.LineTwo : ""}</strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">City:</div>
                  <div className="col-md-8">
                    <strong>{data.pickUp ? data.pickUp.City : ""}</strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">State</div>
                  <div className="col-md-8">
                    <strong>{data.pickUp ? data.pickUp.State : ""}</strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">ZIP/Post Code</div>
                  <div className="col-md-8">
                    <strong>{data.pickUp ? data.pickUp.Zip : ""}</strong>
                  </div>
                </div>

                <div className="position-relative row form-group">
                  <div className="col-md-4">Phone</div>
                  <div className="col-md-8">
                    <strong>{data.pickUp ? data.pickUp.Phone : ""}</strong>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-6">
              <p className="lead bb">Shipping Address</p>
              <form className="form-horizontal">
                <div className="position-relative row form-group">
                  <div className="col-md-4">First Name</div>
                  <div className="col-md-8">
                    <strong>
                      {data.dropOff.Contact
                        ? data.dropOff.Contact.FirstName
                        : ""}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Last Name:</div>
                  <div className="col-md-8">
                    <strong>
                      {data.dropOff.Contact
                        ? data.dropOff.Contact.LastName
                        : ""}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Email:</div>
                  <div className="col-md-8">
                    <strong>
                      {data.dropOff.Contact ? data.dropOff.Contact.Email : ""}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">Address:</div>
                  <div className="col-md-8">
                    <strong>
                      {data.dropOff.ShippingAddress
                        ? data.dropOff.ShippingAddress.LineOne
                        : ""}
                    </strong>
                    <br />
                    <strong>
                      {data.dropOff.ShippingAddress
                        ? data.dropOff.ShippingAddress.LineTwo
                        : ""}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">City:</div>
                  <div className="col-md-8">
                    <strong>
                      {data.dropOff.ShippingAddress
                        ? data.dropOff.ShippingAddress.City
                        : ""}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">State</div>
                  <div className="col-md-8">
                    <strong>
                      {data.dropOff.ShippingAddress
                        ? data.dropOff.ShippingAddress.State
                        : ""}
                    </strong>
                  </div>
                </div>
                <div className="position-relative row form-group">
                  <div className="col-md-4">ZIP/Post Code</div>
                  <div className="col-md-8">
                    <strong>
                      {data.dropOff.ShippingAddress
                        ? data.dropOff.ShippingAddress.Zip
                        : ""}
                    </strong>
                  </div>
                </div>

                <div className="position-relative row form-group">
                  <div className="col-md-4">Phone</div>
                  <div className="col-md-8">
                    <strong>
                      {data.dropOff.Contact ? data.dropOff.Contact.Phone : ""}
                    </strong>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

DetailsCard.propTypes = {
  backHandler: PropType.func,
  data: PropType.shape({
    id: PropType.number.required,
    statusId: PropType.number.required,
    trackingCode: PropType.string.required,
    trackingUrl: PropType.string.required,
    dateCreated: PropType.string.required,
    chargeId: PropType.string,
    paymentAccountId: PropType.string,
    messengerId: PropType.number.required,
    pickUp: PropType.shape({
      Firstname: PropType.string.required,
      LastName: PropType.string.required,
      Email: PropType.string.required,
      Phone: PropType.string.required,
      LineOne: PropType.string.required,
      LineTwo: PropType.string.required,
      City: PropType.string.required,
      State: PropType.string.required,
      Zip: PropType.string.required,
      Location: PropType.shape({
        LineOne: PropType.string.required,
        LineTwo: PropType.string.required,
        City: PropType.string.required,
        State: PropType.string.required,
        Zip: PropType.string.required,
      }),
    }),
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
  }),
};
React.memo;
export default withRouter(DetailsCard);
