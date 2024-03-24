import React, { useState } from 'react';
import axios from 'axios';
import { Location } from "@/types/location";
import MapComponent from './mapComponent'

interface Props {
  onClose: () => void;
  refreshTable: () => void;
  editData: Location | null;
  setEditData: React.Dispatch<React.SetStateAction<Location | null>>;
}
interface Prediction {
  description: string;
}

const LocationForm: React.FC<Props> = ({ onClose, refreshTable, editData, setEditData }) => {
  const isEditMode = !!editData;

  const [formData, setFormData] = useState({
    NickName: "",
    Address: "",
    Latitude: 0,
    Longitude: 0,
  });
  const [errors, setErrors] = useState({
    NickName: "",
    Address: "",
  });
  const [searchResults, setSearchResults] = useState<string[]>([]); // State to hold search results

  React.useEffect(() => {
    clearFormFields();
  }, []);

  React.useEffect(() => {
    clearFormFields();
    if (editData) {
      setFormData({
        NickName: editData.NickName,
        Address: editData.Address,
        Latitude: editData.Latitude,
        Longitude: editData.Longitude
      });
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (isEditMode) {
          const response = await axios.put(`https://nectar-101-backend.vercel.app/api/v1/location/${editData._id}`, formData);
          setEditData(null);
        } else {
          const response = await axios.post('https://nectar-101-backend.vercel.app/api/v1/location', formData);
        }
        clearFormFields();
        onClose();
        refreshTable();
      } catch (error) {
        console.error("Error adding location:", error);
        alert("Failed to add location. Please try again later.");
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      NickName: "",
      Address: "",
    };

    if (formData.NickName.trim() === "") {
      newErrors.NickName = "Nick name is required";
      valid = false;
    }
    if (formData.Address.trim() === "") {
      newErrors.Address = "Address is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleClear = () => {
    clearFormFields();
  };

  const handleClose = () => {
    setEditData(null);
    clearFormFields();
    onClose()
  };

  const mapPinUpdated = async (lat: number, lng: number) => {
    setFormData(prevData => ({
      ...prevData,
      Latitude: lat,
      Longitude: lng
    }));

    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
      const address = response.data.results[0].formatted_address;
      setFormData(prevData => ({
        ...prevData,
        Address: address
      }));
    } catch (error) {
      console.error("Error fetching address:", error);
      alert("Failed to fetch address. Please try again later.");
    }
  };

  const handleAddressSearch = (searchText: string) => {
    const autocompleteService = new window.google.maps.places.AutocompleteService();
  
    autocompleteService.getPlacePredictions({ input: searchText }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        const formattedPredictions: Prediction[] = predictions.map(prediction => ({
          description: prediction.description
        }));
        setSearchResults(formattedPredictions.map(prediction => prediction.description));
      } else {
        console.error("Error searching address:", status);
      }
    });
  };
  
  

  const handleAddressSelect = async (selectedAddress: string) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${selectedAddress}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
      const results = response.data.results;
      const firstResult = results[0];
      const { formatted_address, geometry } = firstResult;
      const { lat, lng } = geometry.location;
  
      setFormData(prevData => ({
        ...prevData,
        Address: formatted_address,
        Latitude: lat,
        Longitude: lng
      }));
  
      setSearchResults([]); 
    } catch (error) {
      console.error("Error selecting address:", error);
    }
  };
  

  const clearFormFields = () => {
    setFormData({
      NickName: "",
      Address: "",
      Latitude: 0,
      Longitude: 0
    });
    setErrors({
      NickName: "",
      Address: "",
    });
    setSearchResults([]); 
  };

  return (
    <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Location Details
            </h3>
            <h5 className="font-medium text-gray-700 text-xs dark:text-white">
              (Kindly fill in the following information.)
            </h5>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6">
                <div className="w-full">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Nick name
                  </label>
                  <input
                    type="text"
                    name="NickName"
                    value={formData.NickName}
                    onChange={handleChange}
                    placeholder="Enter nick name"
                    className={`${errors.NickName ? 'border-rose-500' : ''} w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.NickName ? "border-red-500" : ""}`}
                  />
                  {errors.NickName && <span className="pl-1 text-rose-500 text-xs">{errors.NickName}</span>}
                </div>

                <div className="w-full relative">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Address
                  </label>
                  <input
                    type="text"
                    name="Address"
                    value={formData.Address}
                    onChange={(e) => { handleChange(e); handleAddressSearch(e.target.value); }}
                    placeholder="Enter Address"
                    className={`${errors.Address ? 'border-rose-500' : ''} w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.Address ? "border-red-500" : ""}`}
                  />
                 
                 {errors.Address && <span className="pl-1 text-rose-500 text-xs">{errors.Address}</span>}

                  {searchResults.length > 0 && (
                    <ul className="absolute left-0 mt-1 w-full bg-white rounded shadow-lg z-10">
                      {searchResults.map((result, index) => (
                        <li
                          key={index}
                          className="py-2 px-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => handleAddressSelect(result)}
                        >
                          {result}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="form-group w-full flex justify-end">
                {!isEditMode ? (
                  <button type="button" onClick={handleClear} className="border border-stroke mr-4 px-4 py-2 rounded-lg text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800">
                    Clear
                  </button>
                ) : null}
                <button type="button" onClick={handleClose} className="border border-stroke px-4 py-2 rounded-lg text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 mr-4">
                  Close
                </button>
                {isEditMode ? (
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                    Update
                  </button>
                ) : (
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                    Submit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Map View
            </h3>
          </div>
          <div className="flex flex-col gap-5.5 p-6.5">
            <div>
              <MapComponent
                markedloc={{ "lat": formData.Latitude, "lng": formData.Longitude }}
                sendData={mapPinUpdated}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
