import React, { useEffect, useState } from 'react';
import { GoogleMap as GMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import pinIcon from '../../../assets/images/pin.png';
import getAddressFromLocation from './getAddressFromLocation';
import { BiCurrentLocation } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import getMapApiKey from './getMapApiKey';
import { GOOGLE_MAP_LOADER_OPTIONS } from '../../../Config/googleMaps';

const mapApiKey = getMapApiKey();

function GoogleMap(props) {
  const [loc, setLoc] = useState();
  const { t } = useTranslation();
  const { isLoaded } = useJsApiLoader(GOOGLE_MAP_LOADER_OPTIONS);

  const onClickMap = async (e) => {
    const latLng = e.latLng;
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng(),
    };
    props.setLocation(location);
    const address = await getAddressFromLocation(location, mapApiKey);
    props.setAddress(address);
  };

  const handleSubmit = async (event) => {
    const location = {
      lat: event?.lat,
      lng: event?.lng,
    };
    props.setLocation(location);
    const address = await getAddressFromLocation(location, mapApiKey);
    props.setAddress(address);
  };

  const currentLocation = async () => {
    await navigator.geolocation.getCurrentPosition(
      function (position) {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLoc(location);
      },
      function (error) {
        toast.warning(t('turn.on.gps'));
      },
    );
  };

  useEffect(() => {
    currentLocation();
  }, []);

  const containerStyle = { height: 400, width: '100%' };
  return (
    <div className='map-container' style={containerStyle}>
      <button
        className='map-button'
        type='button'
        onClick={() => {
          currentLocation();
          if (loc) {
            handleSubmit(loc);
          }
        }}
      >
        <BiCurrentLocation />
      </button>
      {isLoaded ? (
        <GMap
          mapContainerStyle={containerStyle}
          center={props.location}
          zoom={10}
          onClick={onClickMap}
          options={{ gestureHandling: 'auto' }}
        >
          <Marker
            position={props.location}
            icon={{
              url: pinIcon,
              scaledSize: typeof window !== 'undefined' && window.google ? new window.google.maps.Size(32, 32) : undefined,
            }}
            className='marker'
          />
        </GMap>
      ) : (
        'Loading...'
      )}
    </div>
  );
}

export default GoogleMap;
