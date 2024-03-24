import React, { useState } from 'react';
import { FaEdit, FaTrash,FaSyncAlt } from 'react-icons/fa';
import { Location } from "@/types/location";
import Swal from 'sweetalert2';

interface Props {
  data: Location[];
  columns: { header: string; key: string }[];
  addNew: () => void;
  refreshTable:()=> void;
  handleEdit: (id: string) => void;
}

const TableThree: React.FC<Props> = ({ data, columns, addNew,refreshTable,handleEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter(item => {
    return Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this location!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`https://nectar-101-backend.vercel.app/api/v1/location/${id}`, {
            method: 'DELETE',
          });
          refreshTable();
          Swal.fire(
            'Deleted!',
            'Your location has been deleted.',
            'success'
          );
        } catch (error) {
          console.error("Error deleting location:", error);
          Swal.fire(
            'Error!',
            'Failed to delete location. Please try again later.',
            'error'
          );
        }
      } else {
        Swal.fire(
          'Cancelled',
          'Your location is safe :)',
          'info'
        );
      }
    });
  };
  
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-4">
        {/* Search Input */}
        <div>
          <input
            type="text"
            placeholder={`Search in ${data.length} records...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-2 py-2 rounded-md dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
           <button onClick={refreshTable} title='Refresh' className="ml-1 hover:text-indigo-600 bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400">
            <FaSyncAlt />
          </button>
        </div>
        {/* Add New Button */}
        <button onClick={addNew} className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark">
          Add New
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {columns.map((column, index) => (
                <th key={index} className="px-4 py-4 font-medium text-black dark:text-white">
                  {column.header}
                </th>
              ))}
              <th className="px-2 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, key) => (
              <tr key={key}>
                {columns.map((column, index) => (
                  <td key={index} className="border-b border-[#eee] px-4 py-3 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {item[column.key]}
                    </p>
                  </td>
                ))}
                <td className="border-b border-[#eee] px-2 py-3 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button onClick={() => handleEdit(item._id)} className="hover:text-primary" title='Edit'>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="hover:text-danger" title='Delete'>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">

      <div>
          Page {currentPage} of {totalPages}
        </div>
        <div>
          <button
            className="bg-primary cursor-pointer text-white py-2 px-4 rounded-md mr-2"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            className="bg-primary cursor-pointer text-white py-2 px-4 rounded-md"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableThree;
