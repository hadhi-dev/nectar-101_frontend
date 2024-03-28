import React, { useState } from 'react';
import axios from 'axios';
import { Location } from "@/types/location";
import MapComponent from './mapComponent'
import GMapComponent from './mapComponentGoogle'

import { FaSearch } from 'react-icons/fa'
interface Props {
  onClose: () => void;
  refreshTable: () => void;
  editData: Location | null;
  setEditData: React.Dispatch<React.SetStateAction<Location | null>>;
}
interface NominatimResult {
  display_name: string;
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
  const [searchResults, setSearchResults] = useState<string[]>([]); 
  const [showMapComponent, setShowMapComponent] = useState<boolean>(false); 

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
  const toggleMapComponent = () => {
    clearFormFields();
    setShowMapComponent(prevState => !prevState);
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
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const response = await axios.get(url);
      const address = response.data.display_name;
  
      setFormData(prevData => ({
        ...prevData,
        Address: address
      }));
    } catch (error) {
      console.error("Error fetching address:", error);
      alert("Failed to fetch address. Please try again later.");
    }
  };  

  const handleAddressSearch = async (searchText: string) => {
    try {
      const response = await axios.get<NominatimResult[]>(`https://nominatim.openstreetmap.org/search?format=json&q=${searchText}`);
      
      if (response.data.length === 0) {
        throw new Error('No results found for the search text');
      }
      
      const formattedPredictions = response.data.map(result => result.display_name);
      setSearchResults(formattedPredictions);
    } catch (error) {
      console.error("Error searching address:", error);
    }
  };
  
  

  const handleAddressSelect = async (selectedAddress: string) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${selectedAddress}`);
      
      if (response.data.length === 0) {
        throw new Error('No results found for the selected address');
      }
      
      const firstResult = response.data[0];
      const { display_name, lat, lon } = firstResult;
  
      setFormData(prevData => ({
        ...prevData,
        Address: display_name,
        Latitude: Number(lat),
        Longitude: Number(lon)
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
    <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
      
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
            <div className="p-6">
              <div className="mb-4 flex flex-wrap">
                <div className="w-1/3 p-2 pl-0">
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Nickname
                  </label>
                  <input
                    type="text"
                    name="NickName"
                    value={formData.NickName}
                    onChange={handleChange}
                    placeholder="Enter Nickname"
                    className={`${errors.NickName ? 'border-rose-500' : ''} w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.NickName ? "border-red-500" : ""}`}
                  />
                  {errors.NickName && <span className="pl-1 font-bold animate-pulse text-rose-700 text-xs">{errors.NickName}</span>}
                </div>

                <div className="w-2/3 relative p-2 pr-0">
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaSearch className="text-gray-300" />
                    </span>
                    <input
                      type="text"
                      name="Address"
                      value={formData.Address}
                      onChange={(e) => { handleChange(e); handleAddressSearch(e.target.value); }}
                      placeholder="Search Address..."
                      className={`${errors.Address ? 'border-rose-500' : ''} w-full pl-10 pr-5 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.Address ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.Address && <span className="pl-1 font-bold animate-pulse text-rose-700 text-xs">{errors.Address}</span>}

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
                <div  className='w-full'>
      <button className='float-right p-1 rounded-full mb-1 px-2 hover:bg-indigo-600 text-xs bg-slate-400 text-white' onClick={toggleMapComponent}>Toggle Map View</button>
      <div className='w-full'>
      {showMapComponent ? (
        <MapComponent
          markedloc={{ lat: formData.Latitude, lng: formData.Longitude }}
          sendData={mapPinUpdated}
        />
      ) : (
        <GMapComponent
          markedloc={{ lat: formData.Latitude, lng: formData.Longitude }}
          sendData={mapPinUpdated}
        />
      )}
    </div>
    </div>
              </div>

              <div className="form-group w-full flex justify-end mt-2">
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
    </div>
  );
};

export default LocationForm;
