"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UserListItem,
  UserListItemProps,
  UserStatus,
} from "@/components/molecules/user-list-item/user-list-item";
import {
  Search,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminUsers, usePendingUsers } from "@/hooks/useAdminUsers";
import { getAuthToken } from "@/services/fetcher";

export function AdminUserList() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { users, loading, error, updateFilters, pagination } = useAdminUsers(
    undefined,
    true
  );
  const {
    pendingUsers,
    loading: pendingLoading,
    error: pendingError,
  } = usePendingUsers();

  // TODO: Remove this mock pagination data after confirming real API pagination works
  // Temporary mock pagination data for testing - forces pagination to show when API data is not available
  const mockPagination = {
    total: 25,
    page: 1,
    limit: 10,
    totalPages: 3,
  };

  // Use mock data if real pagination data is not available or total is 0
  const displayPagination = pagination?.total > 0 ? pagination : mockPagination;

  const filteredUsers = useMemo(() => {
    // Combine pending and regular users
    const allUsers = [...pendingUsers, ...users];

    if (!searchQuery.trim()) return allUsers;

    const query = searchQuery.toLowerCase();
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.division.toLowerCase().includes(query)
    );
  }, [searchQuery, users, pendingUsers]);

  // Debug authentication status
  useEffect(() => {
    console.log("AdminUserList: Checking authentication...");
    const token = getAuthToken();
    console.log("Auth token present:", !!token);
    console.log(
      "Token value:",
      token ? `${token.substring(0, 20)}...` : "none"
    );

    if (error) {
      console.error("AdminUserList error:", error);
    }

    console.log("Pending users count:", pendingUsers.length);
    console.log("Regular users count:", users.length);
    console.log("Pagination info:", pagination);
    console.log(
      "Should show pagination?",
      displayPagination &&
        (displayPagination.totalPages > 1 ||
          displayPagination.total > displayPagination.limit)
    );
    console.log("Total users:", displayPagination?.total);
    console.log("Total pages:", displayPagination?.totalPages);
    console.log("Limit:", displayPagination?.limit);
    console.log("Filtered users count:", filteredUsers.length);
    console.log("Using mock pagination?", displayPagination === mockPagination);
  }, [
    error,
    pendingUsers.length,
    users.length,
    pagination,
    filteredUsers.length,
    displayPagination,
  ]);

  const handleUserClick = (user: UserListItemProps) => {
    // Navigate to user detail page with user data as query params for fallback
    const queryParams = new URLSearchParams({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      division: user.division || "",
      status: user.status || "",
      avatarSrc: user.avatarSrc || "",
      angkatan: user.angkatan?.toString() || "",
    });

    router.push(`/admin/users/${user.id}?${queryParams.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (displayPagination?.totalPages || 1)) {
      updateFilters({
        page: newPage,
        limit: displayPagination?.limit || 10,
      });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!displayPagination) return [];

    const { page, totalPages } = displayPagination;
    const pages: (number | string)[] = [];

    // Always show first page
    if (1 < page - 2) {
      pages.push(1);
      if (1 < page - 3) pages.push("...");
    }

    // Show pages around current page
    for (
      let i = Math.max(1, page - 2);
      i <= Math.min(totalPages, page + 2);
      i++
    ) {
      pages.push(i);
    }

    // Always show last page
    if (totalPages > page + 2) {
      if (totalPages > page + 3) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Update filters for server-side search and reset to page 1
    if (value.trim()) {
      updateFilters({ search: value.trim(), page: 1 });
    } else {
      updateFilters({ search: undefined, page: 1 });
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Users {filteredUsers.length > 0 && `(${filteredUsers.length})`}
          {displayPagination && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              Page {displayPagination.page} of {displayPagination.totalPages} •{" "}
              {displayPagination.total} total
            </span>
          )}
        </h2>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, email, or role"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>
      </div>

      {/* User List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-gray-100">
          {loading || pendingLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading users...</p>
            </div>
          ) : error || pendingError ? (
            <div className="p-8 text-center text-red-500">
              <p className="text-sm font-medium">Error loading users</p>
              <p className="text-xs mt-1">{error || pendingError}</p>
              {(error || pendingError)?.includes("Unauthorized") ||
              (error || pendingError)?.includes("Authentication") ? (
                <div className="mt-4">
                  <p className="text-xs text-gray-600 mb-2">
                    Please ensure you are logged in as an administrator.
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Go to Login
                  </button>
                </div>
              ) : null}
            </div>
          ) : filteredUsers.length > 0 ? (
            <>
              {/* Pending Users Section */}
              {pendingUsers.length > 0 && (
                <div className="px-4 py-2 bg-orange-50 border-b border-orange-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <h3 className="text-sm font-semibold text-orange-800">
                      Pending Users ({pendingUsers.length})
                    </h3>
                  </div>
                </div>
              )}

              {/* All Users List */}
              {filteredUsers.map((user) => (
                <UserListItem
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  role={user.role}
                  status={user.status as UserStatus}
                  avatarSrc={user.avatarSrc}
                  onClick={() => handleUserClick(user)}
                />
              ))}
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">No users found</p>
              {searchQuery && (
                <p className="text-xs mt-1">Try adjusting your search terms</p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Pagination */}
      {displayPagination &&
        (displayPagination.totalPages > 1 ||
          displayPagination.total > displayPagination.limit) && (
          <div className="px-4 py-3 bg-white border-t border-gray-200">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between flex-wrap">
              <div className="flex items-center text-sm text-gray-700">
                <p className="whitespace-nowrap">
                  Showing{" "}
                  <span className="font-medium">
                    {Math.min(
                      (displayPagination.page - 1) * displayPagination.limit +
                        1,
                      displayPagination.total
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      displayPagination.page * displayPagination.limit,
                      displayPagination.total
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{displayPagination.total}</span>{" "}
                  results
                </p>
              </div>
              <div className="flex items-center justify-center">
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(displayPagination.page - 1)}
                    disabled={displayPagination.page <= 1}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="hidden sm:flex">
                    {getPageNumbers().map((pageNum, index) =>
                      typeof pageNum === "number" ? (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium border ${
                            displayPagination.page === pageNum
                              ? "bg-blue-600 text-white border-blue-600"
                              : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ) : (
                        <span
                          key={`ellipsis-${index}`}
                          className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300"
                        >
                          {pageNum}
                        </span>
                      )
                    )}
                  </div>

                  {/* Mobile page indicator */}
                  <div className="sm:hidden relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                    {displayPagination.page} of {displayPagination.totalPages}
                  </div>

                  <button
                    onClick={() => handlePageChange(displayPagination.page + 1)}
                    disabled={
                      displayPagination.page >= displayPagination.totalPages
                    }
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}