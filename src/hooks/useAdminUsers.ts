import { useState, useEffect, useCallback } from "react";
import {
  AdminUser,
  UserFilters,
  PaginatedUsersResponse,
  fetchAdminUsers,
  fetchPendingUsers,
  updateUserStatus,
  deleteUserAccount,
} from "@/services/userService";

export function useAdminUsers(
  initialFilters?: UserFilters,
  excludePending = true
) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<UserFilters>(initialFilters || {});

  const fetchUsers = useCallback(
    async (newFilters?: UserFilters) => {
      const currentFilters = newFilters || filters;
      setLoading(true);
      setError(null);

      try {
        const response: PaginatedUsersResponse = await fetchAdminUsers(
          currentFilters
        );
        let filteredData = response.data;

        // Exclude pending users if excludePending is true
        if (excludePending) {
          filteredData = response.data.filter(
            (user) => user.status !== "Pending"
          );
        }

        setUsers(filteredData);
        // Ensure we have valid pagination data
        const totalPages = Math.max(
          1,
          Math.ceil(response.total / response.limit)
        );

        setPagination({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: totalPages,
        });

        console.log("Pagination updated:", {
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: totalPages,
          shouldShow: totalPages > 1 || response.total > response.limit,
        });
        setFilters(currentFilters);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
        console.error("Error fetching admin users:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const updateUserStatusHandler = useCallback(
    async (userId: string | number, status: string) => {
      try {
        const updatedUser = await updateUserStatus(userId, status);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: status as any } : user
          )
        );
        return updatedUser;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update user status"
        );
        throw err;
      }
    },
    []
  );

  const deleteUserHandler = useCallback(async (userId: string | number) => {
    try {
      await deleteUserAccount(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
      throw err;
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters: Partial<UserFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      fetchUsers(updatedFilters);
    },
    [filters, fetchUsers]
  );

  const refreshUsers = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    filters,
    fetchUsers,
    updateUserStatus: updateUserStatusHandler,
    deleteUser: deleteUserHandler,
    updateFilters,
    refreshUsers,
  };
}

export function usePendingUsers() {
  const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const users = await fetchPendingUsers();
      setPendingUsers(users);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch pending users"
      );
      console.error("Error fetching pending users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const approveUser = useCallback(async (userId: string | number) => {
    try {
      const updatedUser = await updateUserStatus(userId, "Approved");
      setPendingUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve user");
      throw err;
    }
  }, []);

  const rejectUser = useCallback(async (userId: string | number) => {
    try {
      const updatedUser = await updateUserStatus(userId, "Rejected");
      setPendingUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject user");
      throw err;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  return {
    pendingUsers,
    loading,
    error,
    fetchPending,
    approveUser,
    rejectUser,
  };
}
