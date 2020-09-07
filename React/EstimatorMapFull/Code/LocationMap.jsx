import React from "react";
import {
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
} from "../../EstimatorPublicPage/Code/node_modules/@react-google-maps/api";
import PropTypes from "prop-types";
import * as mapStyles from "./mapStyle";
import "./location.scss";
const containerStyle = {
  width: "100%",
  height: "100%",
};

class CustomerMap extends React.Component {
  request = () => {
    return {
      destination: this.props.dest,
      origin: this.props.org,
      travelMode: this.props.method,
    };
  };

  render() {
    return (
      <div className="map-container">
        <GoogleMap
          id="direction-example"
          mapContainerStyle={containerStyle}
          zoom={3}
          options={{
            styles: mapStyles.mapStyleFour,
            mapTypeControl: false,
            streetViewControl: false,
          }}
          center={this.props.GPS}
        >
          {this.props.dest !== "" && this.props.org !== "" && (
            <DirectionsService
              options={this.request()}
              callback={this.props.directionsCallBack}
            />
          )}

          {this.props.response !== null && (
            <DirectionsRenderer
              options={{
                directions: this.props.response,
                polylineOptions: {
                  strokeColor: "black",
                },
              }}
            />
          )}
        </GoogleMap>
      </div>
    );
  }
}
CustomerMap.propTypes = {
  GPS: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  org: PropTypes.string,

  dest: PropTypes.string,
  method: PropTypes.string,
  response: PropTypes.shape({}),
  directionsCallBack: PropTypes.func,
  dimensions: PropTypes.shape({
    height: PropTypes.string,
    width: PropTypes.string,
  }),
};
export default CustomerMap;
