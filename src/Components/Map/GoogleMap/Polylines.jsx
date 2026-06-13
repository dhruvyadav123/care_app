import React, { Fragment } from "react";
import HeaderCard from "../../Common/Component/HeaderCard";
import { Polylines } from "../../../Constant";
import { Card, CardBody, Col } from "reactstrap";
import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAP_LOADER_OPTIONS } from "../../../Config/googleMaps";

const containerStyle = {
  height: "500px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const PolylinesMapComp = () => {
  const polylinetriangleCoords = [
    { lat: 37.772, lng: -122.214 },
    { lat: 21.291, lng: -157.821 },
    { lat: -18.142, lng: 178.431 },
    { lat: -27.467, lng: 153.027 },
  ];

  const { isLoaded } = useJsApiLoader(GOOGLE_MAP_LOADER_OPTIONS);

  return (
    <Fragment>
      <Col xl="6" md="12">
        <Card>
          <HeaderCard title={Polylines} />
          <CardBody>
            <div className="map-js-height">
              <div id="gmap-simple" className="map-block">
                {isLoaded ? (
                  <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
                    <Polyline paths={polylinetriangleCoords} geodesic={true} strokeColor="#FF0000" strokeOpacity={1.0} strokeWeight={2} />
                  </GoogleMap>
                ) : (
                  "LOADING...."
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Fragment>
  );
};

export default PolylinesMapComp;
