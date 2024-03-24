import React, { useState, useEffect } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableThree from "@/components/Tables/TableThree";
import LocationForm from "./locationForm";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Location } from "@/types/location";

export const metadata: Metadata = {
  title: "Assignment#101 - Location",
  description: "This is Location page for Assignment #101",
};

const Main = () => {
  const [locationData, setLocationData] = useState<Location[]>([]); // Provide the type for locationData
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Define the type for error
  const [showAddLocationForm, setShowAddLocationForm] = useState(false);
  const [editData, setEditData] = useState<Location | null>(null);

  useEffect(() => {
    refreshTable()
  }, []);

  const refreshTable = () => {
    fetch('https://nectar-101-backend.vercel.app/api/v1/location')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setLocationData(data.result);
        setLoading(false);
        setError(null);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  const toggleAddLocationForm = () => {
    setShowAddLocationForm(prevState => !prevState);
  };

  const handleEdit = (id: string) => {
    const editItem = locationData.find(item => item._id === id);
    if (editItem) {
      setEditData(editItem);
      toggleAddLocationForm();
    }
  };

  const columns = [
    { header: "Location Name", key: "NickName" },
    { header: "Address", key: "Address" },
    { header: "Created At", key: "createdAt" }
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Location" />

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <div className="flex flex-col gap-10">
          {!showAddLocationForm ? (
            <>
              <TableThree handleEdit={handleEdit} data={locationData} columns={columns} addNew={toggleAddLocationForm} refreshTable={refreshTable}/>
            </>
          ) : (
            <LocationForm editData={editData} setEditData={setEditData} onClose={toggleAddLocationForm} refreshTable={refreshTable}/>
          )}
        </div>
      )}
    </DefaultLayout>
  );
};

export default Main;
