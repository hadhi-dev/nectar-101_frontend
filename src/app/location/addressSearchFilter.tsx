import React, { useState } from 'react';
import axios from 'axios';
import { Location } from "@/types/location";

interface Props {
  onClose: () => void;
  refreshTable: () => void;
  editData: Location | null;
  setEditData: React.Dispatch<React.SetStateAction<Location | null>>;
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
  const [addressSuggestions, setAddressSuggestions] = useState([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (value.trim() !== '') {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1`);
        setAddressSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleAddressSelect = (selectedAddress: any) => {
    setFormData({
      ...formData,
      Address: selectedAddress.display_name,
      Latitude: parseFloat(selectedAddress.lat),
      Longitude: parseFloat(selectedAddress.lon)
    });
    setAddressSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (isEditMode) {
          // Update
          const response = await axios.post(`https://nectar-101-backend.vercel.app/api/v1/location/${editData._id}`, formData);
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
    onClose();
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
    setAddressSuggestions([]);
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
                    onChange={handleInputChange}
                    placeholder="Enter nick name"
                    className={`${errors.NickName?'border-rose-500' : ''} w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.NickName ? "border-red-500" : ""}`}
                  />
                  {errors.NickName && <span className="pl-1 text-rose-500 text-xs">{errors.NickName}</span>}
                </div>

                <div className="w-full">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Address
                  </label>
                  <input
                    type="text"
                    name="Address"
                    value={formData.Address}
                    onChange={handleInputChange}
                    placeholder="Enter Address"
                    className={`${errors.Address?'border-rose-500' : ''} w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.Address ? "border-red-500" : ""}`}
                  />
                  {errors.Address && <span className="pl-1 text-rose-500 text-xs">{errors.Address}</span>}
                  {addressSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white dark:bg-boxdark border border-gray-300 dark:border-form-strokedark rounded-sm mt-1 w-full max-h-32 overflow-auto">
                      {addressSuggestions.map((address: any) => (
                        <li
                          key={address.place_id}
                          onClick={() => handleAddressSelect(address)}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {address.display_name}
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
                <button
                  type="button"
                  onClick={handleClose}
                  className="border border-stroke px-4 py-2 rounded-lg text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 mr-4"
                  >
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
  
        {/* <!-- MapComponent View --> */}
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Location Map View
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <p className="mb-3 block text-sm font-medium text-black dark:text-white">
                  map component
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default LocationForm;
  
