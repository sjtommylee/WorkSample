import React from "react";
import {
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import * as mapStyles from "../locations_customer/mapStyle";
import "./estimator.scss";
const containerStyle = {
  width: "100%",
  height: "100%",
};

class LocationMap extends React.Component {
  request = () => {
    return {
      destination: this.props.dest,
      origin: this.props.org,
      travelMode: this.props.method,
    };
  };

  render() {
    return (
      <GoogleMap
        id="direction-example"
        mapContainerStyle={containerStyle}
        zoom={8}
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
                strokeColor: "#FC4575",
              },
            }}
          />
        )}
      </GoogleMap>
    );
  }
}

export default LocationMap;