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

  const [filterType, setFilterType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    batchYear: "",
    currentOrganization: "",
    location: "",
  });

  const filterOptions = [
    { value: "name", label: "Name", icon: UserGroupIcon, placeholder: "Search by name..." },
    { value: "batchYear", label: "Batch Year", icon: AcademicCapIcon, placeholder: "e.g., 2020" },
    { value: "currentOrganization", label: "Organization", icon: BuildingOfficeIcon, placeholder: "Search by company/institute..." },
    { value: "location", label: "Location", icon: MapPinIcon, placeholder: "Search by location..." },
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
    setFilters({ name: "", batchYear: "", currentOrganization: "", location: "" });
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
              <UserGroupIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
            Alumni Directory
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted max-w-2xl mx-auto px-4">
            Connect with fellow alumni and expand your professional network.
            Search by name, batch year, organization, or location.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-surface rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-white/5">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted" />
            <h2 className="text-base sm:text-lg font-semibold text-on-surface">
              Search & Filter
            </h2>
          </div>

          <form onSubmit={handleFilterSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Filter By</label>
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => handleFilterTypeChange(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-white/10 rounded-lg bg-white/5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 appearance-none transition-colors text-sm"
                  >
                    {filterOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-surface text-on-surface">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-2">Search Value</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {React.createElement(getCurrentFilter().icon, {
                      className: "w-5 h-5 text-muted",
                    })}
                  </div>
                  <input
                    type={filterType === "batchYear" ? "number" : "text"}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={getCurrentFilter().placeholder}
                    className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-lg bg-white/5 text-on-surface placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary text-background font-semibold rounded-lg hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 shadow-md hover:shadow-lg text-sm transform hover:scale-105"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 text-on-surface font-medium rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear All Filters</span>
              </button>

              {Object.values(filters).some(value => value !== "") && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>Active filters:</span>
                  {Object.entries(filters).map(([key, value]) => 
                    value && (
                      <span key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                        {filterOptions.find(opt => opt.value === key)?.label}: {value}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-surface rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-white/5">
          {loading ? (
            <div className="flex justify-center py-8 sm:py-12">
              <Spinner />
            </div>
          ) : users.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className="bg-white/5 rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-primary/20"
                  >
                    <div className="text-center">
                      <img
                        src={
                          user.profilePicture?.startsWith("http")
                            ? user.profilePicture
                            : user.profilePicture !== "no-photo.jpg"
                            ? `${API_URL}${user.profilePicture}`
                            : `https://ui-avatars.com/api/?name=${user.fullName}&background=f5a623&color=080808&size=128`
                        }
                        alt={user.fullName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 sm:mb-4 object-cover border-2 border-primary/20"
                      />
                      <h3 className="font-semibold text-on-surface text-sm sm:text-base mb-1 truncate">
                        {user.fullName}
                      </h3>
                      <p className="text-primary text-xs sm:text-sm font-medium mb-2">
                        Class of {user.batchYear}
                      </p>
                      {user.currentOrganization && (
                        <p className="text-muted text-xs sm:text-sm truncate mb-1">
                          {user.currentOrganization}
                        </p>
                      )}
                      {user.location && (
                        <p className="text-muted text-xs truncate">
                          📍 {user.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 sm:mt-8 flex items-center justify-between">
                  <div className="text-sm text-muted">
                    Showing page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage <= 1}
                      className="px-3 py-2 text-sm font-medium text-muted bg-white/5 border border-white/10 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage >= pagination.totalPages}
                      className="px-3 py-2 text-sm font-medium text-muted bg-white/5 border border-white/10 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">🔍</div>
              <h3 className="text-lg sm:text-xl font-semibold text-on-surface mb-2">
                No Alumni Found
              </h3>
              <p className="text-muted text-sm sm:text-base">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <AlumniDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
