/* eslint-disable react/no-unescaped-entities */
import React, { Component } from "react";
import LocationMap from "./LocationMap";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import * as serviceHelper from "../../services/serviceHelpers";
import LocationRow from "./LocationRow";
import LocationCard from "./LocationCard";
import "./gridestimator.scss";
import logger from "../../checkout/Code/node_modules/airpals-debug";
import "./estimator.scss";
import Motocloud from "./motocloud.png";

import { Link } from "react-router-dom";
import propType from "prop-types";
const libraries = ["places"];

export default class Estimator extends Component {
  state = {
    GPS: {
      lat: 34.0597,
      lng: -118.3009,
    },
    loopPrevention: true,
    response: null,
    originSet: false,
    destinationSet: false,
    originAddress: "",
    destinationAddress: "",
    method: "DRIVING",
    isMapLoaded: false,
    directionsArray: [],
  };

  getDrivingDirections = () => {
    let directionsArr = [];
    let directionService = new google.maps.DirectionsService();
    directionService.route(
      {
        origin: this.state.originAddress,
        destination: this.state.destinationAddress,
        travelMode: "DRIVING",
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsArr.push({
            id: 1,
            distanceD: response.routes[0].legs[0].distance.value,
            durationD: response.routes[0].legs[0].duration.value,
          });
          this.getWalkingDirections(directionsArr);
        }
      }
    );
  };

  getWalkingDirections = (directionsArr) => {
    let directionService = new google.maps.DirectionsService();
    directionService.route(
      {
        origin: this.state.originAddress,
        destination: this.state.destinationAddress,
        travelMode: "WALKING",
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsArr.push({
            id: 2,

            distanceW: response.routes[0].legs[0].distance.value,
            durationW: response.routes[0].legs[0].duration.value,
          });
          this.getBikingDirections(directionsArr);
        }
      }
    );
  };

  getBikingDirections = (directionsArr) => {
    let directionService = new google.maps.DirectionsService();
    directionService.route(
      {
        origin: this.state.originAddress,
        destination: this.state.destinationAddress,
        travelMode: "BICYCLING",
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsArr.push({
            id: 3,

            distanceB: response.routes[0].legs[0].distance.value,
            durationB: response.routes[0].legs[0].duration.value,
          });
          this.getTransitDirections(directionsArr);
        }
      }
    );
  };

  getTransitDirections = (directionsArr) => {
    let directionService = new google.maps.DirectionsService();
    directionService.route(
      {
        origin: this.state.originAddress,
        destination: this.state.destinationAddress,
        travelMode: "TRANSIT",
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsArr.push({
            id: 4,

            distanceT: response.routes[0].legs[0].distance.value,
            durationT: response.routes[0].legs[0].duration.value,
          });
          this.setState((prevState) => {
            return { ...prevState, directionsArray: directionsArr };
          });
        }
      }
    );
  };
  directionsCallback = (response) => {
    if (
      response !== null &&
      this.state.method &&
      this.state.loopPrevention === true
    ) {
      this.setState(
        (prevState) => {
          return {
            ...prevState,
            response,
            originSet: true,
            destinationSet: true,
            loopPrevention: false,
            isMapLoaded: true,
            distanceD: response.routes[0].legs[0].distance.value,
            durationD: response.routes[0].legs[0].duration.value,
          };
        },
        () => logger("response: ", response)
      );
    }
  };

  onLoad = (autocomplete) => {
    this.autocomplete = autocomplete;
  };
  onDestinationLoad = (autocompleted) => {
    this.autocompleted = autocompleted;
  };

  onPlaceChanged = () => {
    if (this.autocomplete !== null) {
      logger(this.autocomplete.getPlace());
      this.setState(
        (prevState) => {
          return {
            ...prevState,
            originAddress: this.autocomplete.getPlace().formatted_address,
            isMapLoaded: false,
            loopPrevention: true,
          };
        },
        () => this.getDrivingDirections()
      );
    } else {
      logger("Autocomplete is not loaded yet!");
    }
  };
  onDestinationChanged = () => {
    if (this.autocompleted !== null) {
      this.setState(
        (prevState) => {
          return {
            ...prevState,
            destinationAddress: this.autocompleted.getPlace().formatted_address,
            isMapLoaded: false,
            loopPrevention: true,
          };
        },
        () => this.getDrivingDirections()
      );
    } else {
      logger("Autocomplete is not loaded yet!");
    }
  };

  originReset = () => {
    this.setState((...prevState) => {
      return { ...prevState, originAddress: "", originSet: false };
    });
  };

  destinationReset = () => {
    this.setState((prevState) => {
      return { ...prevState, destinationAddress: "", destinationSet: false };
    });
  };

  submitClickHandler = (e) => {
    e.preventDefault();
    this.getDrivingDirections();
  };

  setWalking = () => {
    this.setState(() => {
      return {
        loopPrevention: true,
        method: "WALKING",
        isMapLoaded: false,
      };
    });
  };
  setBiking = () => {
    this.setState(() => {
      return {
        loopPrevention: true,
        method: "BICYCLING",
        isMapLoaded: false,
      };
    });
  };
  setDriving = () => {
    this.setState(() => {
      return {
        loopPrevention: true,
        method: "DRIVING",
        isMapLoaded: false,
      };
    });
  };
  handleRedirect = () => {
    this.props.history.push("/register");
  };

  mapDirections = (directions) => (
    <LocationRow directions={directions} key={directions.id} />
  );

  render() {
    return (
      <>
        <LoadScript
          libraries={libraries}
          googleMapsApiKey={serviceHelper.GOOGLE_APIKEY}
        >
          <div className="content-wrapper container pt-4">
            <div className="row primary">
              <div className="col">
                <h1 className="main-title">
                  Get your estimate before your delivery.
                </h1>
                <br />
                <p className="sub-text">
                  Enter your starting, ending location to get pricing.
                </p>
                <div className="input-container">
                  <Autocomplete
                    onLoad={this.onLoad}
                    onPlaceChanged={this.onPlaceChanged}
                  >
                    <div className="origin-wrapper">
                      <span className="o-span" />
                      <div className="origin-group">
                        <label>Enter pick up location *</label>
                        <input
                          type="text"
                          placeholder="Where from?"
                          name="origin"
                          className="origin-input"
                          value={this.state.originAddress}
                        />
                      </div>
                      <span className={`reset-field--${this.state.originSet}`}>
                        <em
                          className="fa-2x mr-2 fas fa-times"
                          onClick={this.originReset}
                        />
                      </span>
                    </div>
                  </Autocomplete>
                  <Autocomplete
                    onLoad={this.onDestinationLoad}
                    onPlaceChanged={this.onDestinationChanged}
                  >
                    <div className="destination-wrapper">
                      <span className="d-span" />
                      <div className="destination-group">
                        <label>Enter drop-off location*</label>
                        <input
                          type="text"
                          name="destination"
                          placeholder="Where to?"
                          className="destination-input"
                          value={this.state.destinationAddress}
                        />
                      </div>
                      <span
                        className={`reset-field--${this.state.destinationSet}`}
                      >
                        <em
                          className="fa-2x mr-2 fas fa-times"
                          onClick={this.destinationReset}
                        />
                      </span>
                    </div>
                  </Autocomplete>
                </div>
                <div className="terms-text-container">
                  <p>
                    The estimated fares are merely estimates, and do not reflect
                    variations due to discounts, promotional offers, traffic
                    delays or other factors. Actual fees may vary. Subject to
                    AirPal's <Link to="/">Terms of Service.</Link>
                  </p>
                </div>
              </div>
              <div className="col" style={{ display: "content" }}>
                <img
                  className="scooter-image"
                  style={{ width: "230px" }}
                  src={Motocloud}
                />
              </div>
            </div>

            <div className="row-spacer" />
            <div className="row controller"></div>
            <div className="row terms"></div>
            <div className="row center">
              <div className="col col-secondary">
                <LocationCard
                  destination={this.state.destinationAddress}
                  origin={this.state.originAddress}
                  originSet={this.state.originSet}
                  destinationSet={this.state.destinationSet}
                  driveDuration={this.state.directionsArray}
                  driveDistance={this.state.directionsArray}
                  walkingDuration={this.state.directionsArray}
                  walkingDistance={this.state.directionsArray}
                  bikingDuration={this.state.directionsArray}
                  bikingDistance={this.state.directionsArray}
                  isMapLoaded={this.state.isMapLoaded}
                  handleRedirect={this.handleRedirect}
                  bikeClickHandler={this.setBiking}
                  driveClickHandler={this.setDriving}
                  walkingClickhandler={this.setWalking}
                />
              </div>
              <div className="col map-container" style={{ paddingTop: "30px" }}>
                <LocationMap
                  org={this.state.originAddress}
                  dest={this.state.destinationAddress}
                  directionsCallBack={this.directionsCallback}
                  response={this.state.response}
                  GPS={this.state.GPS}
                  method={this.state.method}
                />
              </div>
            </div>
            <div className="row secondary">
              <div className="col col-secondary">
                <LocationMap
                  org={this.state.originAddress}
                  dest={this.state.destinationAddress}
                  directionsCallBack={this.directionsCallback}
                  response={this.state.response}
                  GPS={this.state.GPS}
                  method={this.state.method}
                />
              </div>
            </div>
          </div>
        </LoadScript>
      </>
    );
  }
}

Estimator.propTypes = {
  Link: propType.shape({
    to: propType.func,
  }),
  to: propType.func,
  history: propType.shape({
    push: propType.func,
  }),
};
