import React from 'react';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import getAddress from './getAddress';
import { shallowEqual } from 'react-redux';
import { Form, Select } from 'antd';
import { useSelector } from 'react-redux';
import { COUNTRY_CODE, MAP_API_KEY } from '../../../Config/AppConstant';

const options = COUNTRY_CODE
  ? { componentRestrictions: { country: 'IN' } }
  : {};

const AddressForm = ({
  value,
  setValue,
  setLocation,
  withLanguages = true,
}) => {
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: MAP_API_KEY,
      libraries: ['places', 'geocode'],
      options,
    });


  const renderSelect = () => {
    return (
      <Select
        allowClear
        searchValue={value}
        showSearch
        autoClearSearchValue
        loading={isPlacePredictionsLoading}
        options={placePredictions?.map((prediction) => ({
          label: prediction.description,
          value: prediction.description,
        }))}
        onSearch={(searchValue) => {
          setValue(searchValue);
          if (searchValue.length > 0) {
            getPlacePredictions({ input: searchValue });
          }
        }}
        onSelect={async (value) => {
          const address = await getAddress(value);
          setLocation({
            lat: address?.geometry.location.lat,
            lng: address?.geometry.location.lng,
          });
        }}
        getPopupContainer={(trigger) => trigger.parentNode}
      />
    );
  };

  if (!withLanguages) {
    return (
      <Form.Item
        label={'address'}
        name='address'
        rules={[{ required: true, message: 'required' }]}
      >
        {renderSelect()}
      </Form.Item>
    );
  }

  return (
    <>
        <Form.Item
          label={'address'}
          name={`address`}
          rules={[
            {
              message: 'required',
            },
          ]}
        >
          {renderSelect()}
        </Form.Item>
    </>
  );
};

export default AddressForm;
