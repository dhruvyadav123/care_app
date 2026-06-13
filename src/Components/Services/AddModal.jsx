import React, { useState, useEffect } from "react";
import {
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormGroup,
  Label,
  Input,
  ModalFooter,
} from "reactstrap";
import { Btn } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
// import usePlacesAutocomplete, {
//   getGeocode,
//   getLatLng,
// } from "use-places-autocomplete";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { GOOGLE_MAP_LOADER_OPTIONS } from "../../Config/googleMaps";
import { addService, fetchServices } from "../../Redux/stateSlice/servicesReducer";
import { fetchServiceCategories } from "../../Redux/stateSlice/serviceCategoryReducer";

const center = {
  lat: 28.745,
  lng: 77.523,
};

const AddModal = (props) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { serviceCategories } = useSelector((state) => state.serviceCategories);
  const [options, setOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    serviceCategoryId: "",
    file: null,
  });

  const [markerPosition, setMarkerPosition] = useState(center);

  // const { ready, value, suggestions, setValue, clearSuggestions } =
  //   usePlacesAutocomplete();

  const { isLoaded } = useJsApiLoader(GOOGLE_MAP_LOADER_OPTIONS);

  const handleFetchCategories = () => {
    dispatch(fetchServiceCategories(1, 100, { type: "service" }));
  };

  useEffect(() => {
    if (serviceCategories && serviceCategories.length) {
      const transformedOptions = serviceCategories.map((category) => ({
        label: category.name,
        value: category._id,
      }));
      setOptions(transformedOptions);
    }
  }, [serviceCategories]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // const handleAddressSelect = async (description) => {
  //   setValue(description, false);
  //   clearSuggestions();

  //   try {
  //     const results = await getGeocode({ address: description });
  //     const { lat, lng } = await getLatLng(results[0]);

  //     setFormData((prev) => ({
  //       ...prev,
  //       address: description,
  //       latitude: lat,
  //       longitude: lng,
  //     }));
  //     setMarkerPosition({ lat, lng });
  //   } catch (error) {
  //     console.error("Error fetching address details:", error);
  //   }
  // };

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const geocoder = new window.google.maps.Geocoder();

    try {
      const results = (await geocoder.geocode({ location: { lat, lng } })).results;

      if (results.length > 0) {
        const address = results[0].formatted_address;
        setFormData((prev) => ({
          ...prev,
          address,
          latitude: lat,
          longitude: lng,
        }));
        setMarkerPosition({ lat, lng });
      } else {
        console.error("No results found for this location.");
      }
    } catch (error) {
      console.error("Error fetching address from coordinates:", error);
    }
  };

  const handleAddService = async () => {
    if (!formData.name || !formData.address) {
      alert("Please fill all required fields.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    data.append("serviceCategoryId", selectedCategory.value);
    if (formData.file) {
      data.append("image", formData.file);
    }

    await dispatch(addService(data));
    props.Modaltoggle();
    await dispatch(fetchServices(1, 10));
  };

  return (
    <Modal
    isOpen={props.viewModal}
    toggle={props.Modaltoggle}
    size="lg"
    centered
  >
    <ModalHeader
      style={{ padding: "15px 0px 0px 20px!important" }}
      toggle={props.Modaltoggle}
    >
      Add Category
    </ModalHeader>
    <hr />
      <ModalBody>
        <Form className="theme-form row">
          <FormGroup className="col-6">
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup className="col-6">
            <Label className="col-form-label pt-0">Select Service Category</Label>
            <Select
              onMenuOpen={handleFetchCategories}
              isLoading={!options.length}
              options={options}
              className="js-example-basic-single col-sm-12"
              value={selectedCategory}
              onChange={(selectedOption) => setSelectedCategory(selectedOption)}
            />
          </FormGroup>
          <FormGroup className="col-9">
            <Label className="col-sm-3 col-form-label">Upload File</Label>
            <Col sm="12">
              <Input
                className="form-control"
                type="file"
                name="file"
                onChange={handleInputChange}
              />
            </Col>
          </FormGroup>
          <FormGroup className="col-12">
            <Label className="col-form-label pt-0">Address</Label>
            <Input
              value={formData.address}
              disabled={true}
              placeholder="Location will be set from the map"
            />
          </FormGroup>
          <FormGroup className="col-12">
            <Label>Select Address</Label>
            <div style={{ height: "400px", width: "100%" }}>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={markerPosition}
                  zoom={10}
                  onClick={handleMapClick}
                >
                  <Marker position={markerPosition} />
                </GoogleMap>
              ) : (
                "Loading..."
              )}
            </div>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: props.AddModaltoggle }}>
          Close
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleAddService }}>
          Save
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default AddModal;
