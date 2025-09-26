"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { UserDetail } from "@/components/molecules/user-detail";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { AdminUser, fetchUserById } from "@/services/userService";
import { Loader2 } from "lucide-react";

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = params.id as string;
  const { updateUserStatus, deleteUser } = useAdminUsers();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchUserById(userId);
        setUser(userData);
        setLoading(false);
      } catch (err) {
        // If API fails, try to use data from query params as fallback
        const name = searchParams.get("name");
        const email = searchParams.get("email");
        const role = searchParams.get("role");
        const division = searchParams.get("division");
        const status = searchParams.get("status");
        const avatarSrc = searchParams.get("avatarSrc");
        const angkatan = searchParams.get("angkatan");

        if (name && email) {
          setUser({
            id: userId,
            name,
            email,
            role,
            division,
            status: (status as AdminUser["status"]) || "Pending",
            avatarSrc: avatarSrc || undefined,
            angkatan: angkatan ? parseInt(angkatan) : undefined,
            username: "",
            full_name: name,
          });
          setLoading(false);
        } else {
          setError(err instanceof Error ? err.message : "Failed to load user");
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [userId, searchParams]);

  const handleBack = () => {
    router.push("/admin/users");
  };

  const handleDelete = async () => {
    if (!userId) return;

    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        router.push("/admin/users");
      } catch (err) {
        alert(
          "Failed to delete user: " +
            (err instanceof Error ? err.message : "Unknown error")
        );
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!userId) return;

    try {
      await updateUserStatus(userId, newStatus);
      setUser((prev) => (prev ? { ...prev, status: newStatus as any } : null));
    } catch (err) {
      alert(
        "Failed to update user status: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  const handleRoleChange = (newRole: string) => {
    // This would be implemented when role update API is available
    console.log("Role change to:", newRole);
    setUser((prev) => (prev ? { ...prev, role: newRole } : null));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {error || "User not found"}
          </h2>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800"
          >
            Go back to users list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserDetail
        id={user.id}
        name={user.name}
        email={user.email}
        division={user.division}
        angkatan={user.angkatan?.toString() || ""}
        status={user.status}
        role={user.role}
        avatarSrc={user.avatarSrc}
        onBack={handleBack}
        onDelete={handleDelete}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        isAdminView={true}
      />
    </div>
  );
}
