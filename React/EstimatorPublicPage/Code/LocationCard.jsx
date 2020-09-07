/* eslint-disable react/prop-types */
import React, { useState } from "react";
import propType from "prop-types";
const minuteFormat = (seconds) => {
  let minutes = seconds / 60;
  let roundedMinutes = Math.round(minutes);
  return roundedMinutes;
};

const distanceFormat = (d) => {
  let miles = (d / 1000) * 0.621371;
  let roundedMiles = Math.round(miles, 2);
  return roundedMiles;
};

const deliverySpeedType = (st) => {
  switch (st) {
    case "None":
      return 0;
    case "ASAP":
      return 9.5;
    case "3HR":
      return 7.19;
    case "5HR":
      return 5.75;
    case null:
      return 0;
  }
};

const parcelSize = (s) => {
  switch (s) {
    case "None":
      return 0;
    case "Small":
      return 1;
    case "Medium":
      return 3;
    case "Large":
      return 6;
    case null:
      return 0;
  }
};



const priceFormula = (t, d, st, s) => {
  let minRate = 0.35;
  let mileRate = 0.6;
  let minConversion = t / 60;
  let rateOne = 0.45;
  let rateTwo = 0.36;
  let costPerMin = (t / 60) * minRate;
  let costPerMile = (d / 1000) * 0.621371 * mileRate;
  let insuranceRate = 0.1;

  let baseRate =
    deliverySpeedType(st) +
    costPerMin +
    costPerMile +
    parcelSize(s) +
    insuranceRate;
  let worksComp = baseRate * 0.025;
  let salesTax = baseRate * 0.0;
  const baseMessengerFee = () => {
    if (minConversion < 60) {
      return minConversion * rateOne;
    } else {
      return minConversion * rateTwo;
    }
  };
  const bookingFee = () => {
    if (baseRate >= 16.76 && baseRate <= 30) {
      let bF = baseRate * 0.2;
      return bF;
    }
    if (baseRate >= 30.1 && baseRate <= 45) {
      let bF = baseRate * 0.17;
      return bF;
    }
    if (baseRate >= 45.1 && baseRate <= 70) {
      let bF = baseRate * 0.15;
      return bF;
    }
    if (baseRate > 70) {
      let bF = baseRate * 0.14;
      return bF;
    } else {
      return null;
    }
  };

  let subTotal = parseFloat(
    baseRate + worksComp + salesTax + bookingFee() + baseMessengerFee()
  ).toFixed(2);
  return subTotal;
};

const DriveInfo = ({
  driveDuration,
  driveDistance,
  driveClickHandler,
  size,
  speedType,
}) => (
    <li className="location-list-item" onClick={driveClickHandler}>
      <div className="location-icon-group">
        <em className="fa-2x mr-2 fas fa-car"></em>
      </div>
      <div className="location-option-content">
        <div className="deliverytype-title">Standard</div>
        <div className="delivery-option">
          In {minuteFormat(driveDuration)} minutes. Distance{" "}
          {distanceFormat(driveDistance)} mi.
      </div>
      </div>
      <div className="delivery-price-container">
        <span className="delivery-price">
          ${priceFormula(driveDuration, driveDistance, speedType, size)}
        </span>
      </div>
    </li>
  );

const BikeInfo = ({
  bikingDuration,
  bikingDistance,
  bikeClickHandler,
  size,
  speedType,
}) => (
    <li className="location-list-item" onClick={bikeClickHandler}>
      <div className="location-icon-group">
        <em className="fa-2x mr-2 fas fa-bicycle"></em>
      </div>
      <div className="location-option-content">
        <div className="deliverytype-title">Premium</div>

        <div className="delivery-option">
          In {minuteFormat(bikingDuration)} min. Distance{" "}
          {distanceFormat(bikingDistance)} mi.
      </div>
      </div>
      <div className="delivery-price-container">
        <span className="delivery-price">
          ${priceFormula(bikingDuration, bikingDistance, speedType, size)}
        </span>
      </div>
    </li>
  );

const WalkingInfo = ({
  walkingDuration,
  walkingDistance,
  walkingClickhandler,
  size,
  speedType,
}) => (
    <li className="location-list-item" onClick={walkingClickhandler}>
      <div className="location-icon-group">
        <em className="fa-2x mr-2 fas fa-train"></em>
      </div>
      <div className="location-option-content">
        <div className="deliverytype-title">Express</div>

        <div className="delivery-option">
          In {minuteFormat(walkingDuration)} mins. Distance{" "}
          {distanceFormat(walkingDistance)} mi.
      </div>
      </div>
      <div className="delivery-price-container">
        <span className="delivery-price">
          ${priceFormula(walkingDuration, walkingDistance, speedType, size)}
        </span>
      </div>
    </li>
  );

const LocationBody = ({
  driveDuration,
  driveDistance,
  walkingDuration,
  walkingDistance,
  bikingDuration,
  bikingDistance,
  isMapLoaded,
  bikeClickHandler,
  driveClickHandler,
  walkingClickhandler,
  size,
  speedType,
  handleRedirect,
}) => {
  return !isMapLoaded ? (
    <>
    <div className="location-loader" />

    <div className="loader-container"></div>
    </>
  ) : (
    <>
  <div className="loader-padding" />
  <div className="location-card-body">
    <div className="location-card-list-container">
      <ul>
        <DriveInfo
          size={size}
          speedType={speedType}
          driveDistance={driveDistance}
          driveDuration={driveDuration}
          driveClickHandler={driveClickHandler}
        />
        <BikeInfo
          size={size}
          speedType={speedType}
          bikingDistance={bikingDistance}
          bikingDuration={bikingDuration}
          bikeClickHandler={bikeClickHandler}
        />
        <WalkingInfo
          size={size}
          speedType={speedType}
          walkingDuration={walkingDuration}
          walkingClickhandler={walkingClickhandler}
          walkingDistance={walkingDistance}
        />

        <li
          className="li-btn-container"
        // style={{
        //   borderBottom: "none",
        //   listStyle: "none",
        //   paddingTop: "8px",
        // }}
        // className="location-list-item-hovernone"
        >
          {/* <Link>Click me</Link> */}
          <div className="sign-up-btn-container mx-auto">
            <button onClick={handleRedirect} className="sign-up-btn">
              Sign up with
                  <img src="logos/airpals-white.png" alt="Logo" className="sign-logo" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
    </>
  );
};

const LocationCard = ({
  driveDuration,
  driveDistance,
  walkingDuration,
  walkingDistance,
  bikingDuration,
  bikingDistance,
  isMapLoaded,
  bikeClickHandler,
  driveClickHandler,
  walkingClickhandler,
  handleRedirect,
}) => {
  const [speedType, setSpeedType] = useState("None");
  const [size, setSize] = useState("None");
  return (
    <div className="location-card-container">
      <div className="location-data-container">
        <div className="location-card-header"></div>

        <div className="header-search-bar-container"></div>
        <div className="location-card-widget">
          <div className="location-dropdown-container">
            <div className="location-group">
              <select
                onChange={(e) => setSpeedType(e.currentTarget.value)}
                className="custom-select"
              >
                <option value={"None"}>Speed</option>
                <option value={"ASAP"}>ASAP</option>
                <option value={"3HR"}>3HR</option>
                <option value={"5HR"}>5HR</option>
              </select>
            </div>
          </div>
          <div className="location-dropdown-container">
            <div className="location-group">
              <select
                onChange={(e) => setSize(e.currentTarget.value)}
                className="custom-select"
              >
                <option value={"None"}>Size</option>
                <option value={"Small"}>Small</option>
                <option value={"Medium"}>Medium</option>
                <option value={"Large"}>Large</option>
              </select>
            </div>
          </div>
        </div>

        <LocationBody
          isMapLoaded={isMapLoaded}
          speedType={speedType}
          size={size}
          driveDistance={driveDistance[0] ? driveDistance[0].distanceD : 0}
          driveDuration={driveDuration[0] ? driveDuration[0].durationD : 0}
          bikingDistance={bikingDistance[2] ? bikingDistance[2].distanceB : 0}
          bikingDuration={bikingDuration[2] ? bikingDuration[2].durationB : 0}
          walkingDuration={
            walkingDuration[1] ? walkingDuration[1].durationW : 0
          }
          walkingDistance={
            walkingDistance[1] ? walkingDistance[1].distanceW : 0
          }
          driveClickHandler={driveClickHandler}
          bikeClickHandler={bikeClickHandler}
          walkingClickhandler={walkingClickhandler}
          handleRedirect={handleRedirect}
        />
      </div>
    </div>
  );
};

DriveInfo.propTypes = {
  driveDuration: propType.number,
  driveDistance: propType.number,
  driveClickHandler: propType.func,
  size: propType.string,
  speedType: propType.string,
};

BikeInfo.propTypes = {
  bikingDuration: propType.number,
  bikingDistance: propType.number,
  bikeClickHandler: propType.func,
  size: propType.string,
  speedType: propType.string,
};
WalkingInfo.propTypes = {
  walkingDuration: propType.number,
  walkingDistance: propType.number,
  walkingClickhandler: propType.func,
  size: propType.string,
  speedType: propType.string,
};

LocationBody.propTypes = {
  driveDuration: propType.number,
  driveDistance: propType.number,
  driveClickHandler: propType.func,
  bikingDuration: propType.number,
  bikingDistance: propType.number,
  bikeClickHandler: propType.func,
  walkingDuration: propType.number,
  walkingDistance: propType.number,
  walkingClickhandler: propType.func,
  size: propType.string,
  speedType: propType.string,
  isMapLoaded: propType.bool,
};

LocationCard.propTypes = {
  driveDuration: propType.arrayOf(
    propType.shape({
      distanceD: propType.number,
      durationD: propType.number,
      durationB: propType.number,
      distanceB: propType.number,
      durationW: propType.number,
      distanceW: propType.number,
    })
  ),

  driveDistance: propType.arrayOf(
    propType.shape({
      distanceD: propType.number,
      durationD: propType.number,
      durationB: propType.number,
      distanceB: propType.number,
      durationW: propType.number,
      distanceW: propType.number,
    })
  ),
  driveClickHandler: propType.func,
  bikingDuration: propType.arrayOf(
    propType.shape({
      distanceD: propType.number,
      durationD: propType.number,
      durationB: propType.number,
      distanceB: propType.number,
      durationW: propType.number,
      distanceW: propType.number,
    })
  ),
  bikingDistance: propType.arrayOf(
    propType.shape({
      distanceD: propType.number,
      durationD: propType.number,
      durationB: propType.number,
      distanceB: propType.number,
      durationW: propType.number,
      distanceW: propType.number,
    })
  ),
  bikeClickHandler: propType.func,
  walkingDuration: propType.arrayOf(
    propType.shape({
      distanceD: propType.number,
      durationD: propType.number,
      durationB: propType.number,
      distanceB: propType.number,
      durationW: propType.number,
      distanceW: propType.number,
    })
  ),
  walkingDistance: propType.arrayOf(
    propType.shape({
      distanceD: propType.number,
      durationD: propType.number,
      durationB: propType.number,
      distanceB: propType.number,
      durationW: propType.number,
      distanceW: propType.number,
    })
  ),
  walkingClickhandler: propType.func,
  isMapLoaded: propType.bool,
  handleRedirect: propType.func,
  onPlaceChanged: propType.func,
  onLoad: propType.func,
  onDestinationLoad: propType.func,
  onDestinationChanged: propType.func,
};

export default LocationCard;
