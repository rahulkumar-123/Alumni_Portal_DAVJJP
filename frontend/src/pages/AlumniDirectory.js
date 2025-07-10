import React, { useState, useEffect } from "react";
import userService from "../services/userService";
import Spinner from "../components/common/Spinner";
import AlumniDetailModal from "../components/directory/AlumniDetailModal";
import toast from "react-hot-toast";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";

const API_URL = process.env.REACT_APP_API_URL.replace("/api", "");

export default function AlumniDirectory() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  // New filtering system
  const [filterType, setFilterType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    batchYear: "",
    currentOrganization: "",
    location: "",
  });

  const filterOptions = [
    {
      value: "name",
      label: "Name",
      icon: UserGroupIcon,
      placeholder: "Search by name...",
    },
    {
      value: "batchYear",
      label: "Batch Year",
      icon: AcademicCapIcon,
      placeholder: "e.g., 2020",
    },
    {
      value: "currentOrganization",
      label: "Organization",
      icon: BuildingOfficeIcon,
      placeholder: "Search by company/institute...",
    },
    {
      value: "location",
      label: "Location",
      icon: MapPinIcon,
      placeholder: "Search by location...",
    },
  ];

  const getCurrentFilter = () =>
    filterOptions.find((option) => option.value === filterType);

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const activeFilters = {
        page,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      };
      const res = await userService.getAlumniDirectory(activeFilters);
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error("Could not fetch alumni.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, filters]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, [filterType]: searchValue };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      batchYear: "",
      currentOrganization: "",
      location: "",
    });
    setSearchValue("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterTypeChange = (newType) => {
    setFilterType(newType);
    setSearchValue(filters[newType] || "");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <UserGroupIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Alumni Directory
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with fellow alumni and expand your professional network.
            Search by name, batch year, organization, or location.
          </p>
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Search & Filter
            </h2>
          </div>

          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Filter Type Dropdown */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter By
                </label>
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => handleFilterTypeChange(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 appearance-none transition-colors"
                  >
                    {filterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none"></div>
                </div>
              </div>

              {/* Search Input */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Value
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {React.createElement(getCurrentFilter().icon, {
                      className: "w-5 h-5 text-gray-400",
                    })}
                  </div>
                  <input
                    type={filterType === "batchYear" ? "number" : "text"}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={getCurrentFilter().placeholder}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 lg:p-[17px] lg:mt-3 width-full lg:col-span-1">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary/70 text-white font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-red-200 text-gray-700 font-medium rounded-lg hover:bg-red-300 transition-colors"
                  title="Clear all filters h-[fit-content]"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {Object.entries(filters).some(([_, value]) => value !== "") && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Active filters:
                  </span>
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null;
                    const option = filterOptions.find(
                      (opt) => opt.value === key
                    );
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {option?.label}: {value}
                        <button
                          type="button"
                          onClick={() => {
                            const newFilters = { ...filters, [key]: "" };
                            setFilters(newFilters);
                            if (filterType === key) setSearchValue("");
                          }}
                          className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => {
              const profileImageUrl = user.profilePicture?.startsWith("http")
                ? user.profilePicture
                : user.profilePicture && user.profilePicture !== "no-photo.jpg"
                ? `${API_URL}${user.profilePicture}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.fullName
                  )}&background=8344AD&color=fff`;

              return (
                <div
                  key={user._id}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100 group"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        className="h-20 w-20 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300"
                        src={profileImageUrl}
                        alt={user.fullName}
                      /> 
                      {/*for showing online status */}
                      {/* <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-sm"></div> */}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {user.fullName}
                    </h3>

                    <div className="flex items-center justify-center gap-1 mb-3">
                      <AcademicCapIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-600 font-semibold text-sm">
                        Batch of {user.batchYear}
                      </span>
                    </div>

                    {user.currentOrganization && (
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-600 truncate max-w-full">
                          {user.currentOrganization}
                        </p>
                      </div>
                    )}

                    {user.location && (
                      <div className="flex items-center justify-center gap-1">
                        <MapPinIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-600 truncate max-w-full">
                          {user.location}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <UserGroupIcon className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Alumni Found
            </h3>
            <p className="text-gray-600 mb-4">
              No results match your current search criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Enhanced Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <div className="text-sm text-gray-600">
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.total
              )}{" "}
              of {pagination.total} alumni
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNumber;
                    if (pagination.totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNumber = pagination.totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          pageNumber === currentPage
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Next
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Alumni Detail Modal */}
        {selectedUser && (
          <AlumniDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </div>
  );
}
