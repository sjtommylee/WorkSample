/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { Component } from "./node_modules/react";
import PropTypes from "./node_modules/prop-types";
import { Field, Formik, Form } from "./node_modules/formik";
import { contactSchema } from "../../schemas/contactSchema";
import logger from "./node_modules/airpals-debug";
import FormRow from "./FormRow";
import { Autocomplete } from "../../EstimatorPublicPage/Code/node_modules/@react-google-maps/api";
import * as lookupService from "../../services/lookupService";
import Geocode from "./node_modules/react-geocode";
const shipmentMapper = require("./shipmentMapper.json");
const _logger = logger.extend("Contact");

_logger("from pickup contact");
export default class Contact extends Component {
  
  }

  filterStates = (states, id) => {
    let filteredStates = states.filter((s) => s.code === id);
    this.setState((prevState) => {
      return { ...prevState, stateId: filteredStates[0].id };
    });
    filteredStates[0].id;
  };

  

  handleNext = (formValues) => {
    const payload = { ...formValues, isActive: true };
    logger("formValues:", formValues);
    if (this.props.componentName === "dropOffContact") {
      if (this.props.formData.id) {
        delete payload.addressObj;
        delete payload.locationType;

        payload.id = this.props.formData.id;
        this.updateContact(payload);
      } else {
        delete payload.id;
        payload.customerId = this.props.customerId;
        this.addContact(payload);
      }
    } else {
      this.props.handleNextPrev(this.props.componentName, formValues);
      payload.lineOne = payload.addressObj.lineOne;
      payload.lineTwo = payload.addressObj.lineTwo;
      payload.locationTypeId = payload.addressObj.locationTypeId;
      payload.city = payload.addressObj.city;
      payload.zip = payload.addressObj.zip;
      payload.stateId = payload.addressObj.stateId;
      payload.latitude = payload.addressObj.latitude;
      payload.longtitude = payload.addressObj.longtitude;

      delete payload.addressObj;
      this.addLocationPayload(payload);
    }
  };

  
  onLoad = (autocomplete) => {
    this.autocomplete = autocomplete;
  };

  onPlaceChanged = (setFieldValue) => {
    if (this.autocomplete !== null) {
      this.props.setAutocompleteAddress(
        this.autocomplete.getPlace().formatted_address,
        this.props.stateAddress,
        this.autocomplete.getPlace().address_components
      );
      logger(this.props.addressArray);

      let addressString = this.autocomplete.getPlace().formatted_address;
      logger(addressString);

      const location = this.props.addressArray;
      if (location) {
        Geocode.fromAddress(addressString).then((response) => {
          const { lat, lng } = response.results[0].geometry.location;
          logger(lat, lng);
          const obj = {
            locationTypeId: shipmentMapper[this.props.locationType || "Home"],
            lineOne: location.street_number + " " + location.route,
            lineTwo: "",
            city: location.locality,
            zip: location.postal_code,
            stateId: shipmentMapper[location.administrative_area_level_1],
            latitude: lat,
            longtitude: lng,
            id: 0,
          };
          logger(obj);
          logger("pppppppppppppppppppppppppp", this.props);


          setFieldValue("addressObj", obj);
        });
      }
    }
  };

  

  initializeLocationTypeStates = async () => {
    const locationType = await this.getAllLocationTypes("LocationTypes");
    const states = await this.getAllStates();

    this.setState((prevState) => {
      return {
        ...prevState,
        locationTypesInfo: locationType.locationTypesInfo,
        locationTypeOptions: locationType.locationTypeOptions,
        statesArray: states.statesInfo,
      };
    });
  };

  getAllLocationTypes = (types) => {
    return lookupService
      .getAllTypes(types)
      .then(this.onGetAllLocationTypesSuccess)
      .catch(this.onGetAllLocationTypesError);
  };

  onGetAllLocationTypesSuccess = (response) => {
    const locationTypesInfo = response.items;
    const locationTypeOptions = locationTypesInfo.map((locationType) => {
      return (
        <option value={locationType.name} key={locationType.id}>
          {locationType.name}
        </option>
      );
    });
    return { locationTypesInfo, locationTypeOptions };
  };
  onGetAllLocationTypesError = (error) => {
    logger("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", error);
  };

  getStateId = () => {
    this.filterStates(this.state.stateList, this.state.addressObj.state);
  };


  render() {
    return (
      <Formik
        enableReinitialize={true}
        validationSchema={contactSchema}
        initialValues={this.propsToFormData(this.props)}
        onSubmit={this.handleNext}
      >
        {(props) => {
          const { touched, errors, handleBlur, values, setFieldValue } = props;
          const handlePrevious = (event) => {
            this.props.handleNextPrev(this.props.componentName, values, event);
          };
          return (
            <>
              <Form>
                <div className="row">
                  <div className="col-md-12">
                    <div className="card-default card">
                      <div className="card-header"></div>
                      <div className="card-body">
                        {this.props.contactList &&
                          this.props.contactList.length !== 0 && (
                            
                          )}

                          {/* Only partial code provided */}
                          <FormRow>
                          <Autocomplete
                            onLoad={this.onLoad}
                            onPlaceChanged={() =>
                              this.onPlaceChanged(setFieldValue)
                            }
                          >
                            <input
                              name="pickupLocation"
                              className="form-control"
                            />
                          </Autocomplete>
                       
                        <FormRow label="Location Type *">
                          <Field
                            component="select"
                            name="locationType"
                            placeholder=""
                            className={
                              errors.locationType && touched.locationType
                                ? "form-control error"
                                : "form-control"
                            }
                          >
                            {this.state.locationTypeOptions}
                          </Field>
                          {errors.locationType && touched.locationType && (
                            <span className="error-feedback">
                              {errors.locationType}
                            </span>
                          )}
                        </FormRow>
                      
              </Form>
            </>
          );
        }}
      </Formik>
    );
  }


