import React, { Component } from "react";
import CustomerMap from "./CustomerMap";
import LocationCard from "./LocationCard";
import { LoadScript } from "../../EstimatorPublicPage/Code/node_modules/@react-google-maps/api";
import { withRouter } from "react-router-dom";
import logger from "../../checkout/Code/node_modules/airpals-debug";
import Geocode from "react-geocode";
import propType from "prop-types";
import * as serviceHelper from "../../services/serviceHelpers";
const libraries = ["places"];

class LocationCustomer extends Component {
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
  componentDidMount() {
    Geocode.setApiKey(serviceHelper.GOOGLE_APIKEY);
    Geocode.setLanguage("en");
  }

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

  handleRedirect = () => {
    this.props.history.push("/register");
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

  render() {
    return (
      <>
        <LoadScript
          libraries={libraries}
          googleMapsApiKey={serviceHelper.GOOGLE_APIKEY}
        >
          <div>
            <CustomerMap
              org={this.state.originAddress}
              dest={this.state.destinationAddress}
              directionsCallBack={this.directionsCallback}
              response={this.state.response}
              GPS={this.state.GPS}
              method={this.state.method}
              onUnmount={this.onUnmount}
            />
            <LocationCard
              onPlaceChanged={this.onPlaceChanged}
              onLoad={this.onLoad}
              onDestinationLoad={this.onDestinationLoad}
              onDestinationChanged={this.onDestinationChanged}
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
        </LoadScript>
      </>
    );
  }
}

LocationCustomer.propTypes = {
  history: propType.shape({
    push: propType.func.required,
  }),
};
React.memo;
export default withRouter(LocationCustomer);
