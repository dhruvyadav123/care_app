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
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { BASE_URL } from "../../Config/AppConstant";
import { GOOGLE_MAP_LOADER_OPTIONS } from "../../Config/googleMaps";
import {
  editService,
  fetchServices,
} from "../../Redux/stateSlice/servicesReducer";
import { fetchServiceCategories } from "../../Redux/stateSlice/serviceCategoryReducer";

const center = {
  lat: 28.745,
  lng: 77.523,
};

const EditModal = (props) => {
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

  useEffect(() => {
    if (props.category) {
      setFormData({
        name: props.category.name || "",
        address: props.category.address || "",
        latitude: props.category.latitude || "",
        longitude: props.category.longitude || "",
        serviceCategoryId: props.category.serviceCategoryId?._id || "",
        file: null,
      });
  
      setMarkerPosition({
        lat: props.category.latitude || center.lat,
        lng: props.category.longitude || center.lng,
      });
  
      // Set the selected category if serviceCategoryId is available
      if (props.category.serviceCategoryId) {
        setSelectedCategory({
          label: props.category.serviceCategoryId.name,
          value: props.category.serviceCategoryId._id,
        });
      } else {
        setSelectedCategory(null); // Clear selection if no serviceCategoryId
      }
    }
  }, [props.category]);

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
  //     console.log("result", results);
  //     const { lat, lng } = await getLatLng(results[0]);

  //     setFormData((prev) => ({
  //       ...prev,
  //       address: description,
  //       latitude: lat,
  //       longitude: lng,
  //     }));
  //     setMarkerPosition({ lat, lng }); // Update marker position
  //   } catch (error) {
  //     console.error("Error fetching address details:", error);
  //   }
  // };

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const geocoder = new window.google.maps.Geocoder();

    try {
      const results = (await geocoder.geocode({ location: { lat, lng } }))
        .results;

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

  const handleEditCategory = async () => {
    if (!formData.name || !formData.address) {
      alert("Please fill all required fields.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    data.append("serviceCategoryId",  selectedCategory.value);
    if (formData.file) {
      data.append("image", formData.file);
    }
    // console.log(props.category._id,selectedCategory.value, formData);
    await dispatch(editService(props.category._id, data));
    props.EditModaltoggle();
    await dispatch(fetchServices(1, 10));
  };

  return (
    <Modal
      isOpen={props.editModal}
      toggle={props.EditModaltoggle}
      size="lg"
      centered
    >
      <ModalHeader toggle={props.EditModaltoggle}>Edit Service</ModalHeader>
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
            <Label className="col-form-label pt-0">
              Select Service Category
            </Label>
            <Select
              onMenuOpen={handleFetchCategories}
              isLoading={!options.length}
              options={options}
              className="js-example-basic-single col-sm-12"
              value={selectedCategory}
  onChange={(selectedOption) => setSelectedCategory(selectedOption)}
            />
          </FormGroup>
          <FormGroup className="col-3 mt-2">
            <img
              src={`${BASE_URL}/uploads/${props?.category?.image}`}
              width={"100"}
              height={"70"}
              className="radius"
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
              disabled={true} // Disable manual input
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
        <Btn attrBtn={{ color: "secondary", onClick: props.EditModaltoggle }}>
          Close
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleEditCategory }}>
          Save
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
