"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/atoms/ui/input";
import { Label } from "@/components/atoms/ui/label";
import { Button } from "@/components/atoms/ui/button";
import { Checkbox } from "@/components/atoms/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../molecules/alert/alert";
import { XCircle, Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/services/api";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [division_id, setDivision] = useState("");
  const [angkatan, setAngkatan] = useState<number | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !email ||
      !fullName ||
      !division_id ||
      !angkatan ||
      !password ||
      !confirmPassword
    ) {
      setError("Semua field wajib diisi");
      return;
    }

    if (password.length < 6) {
      setError("Password harus minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sesuai");
      return;
    }

    if (!agreeToTerms) {
      setError("Anda harus menyetujui syarat & ketentuan");
      return;
    }

    try {
      setLoading(true);
      const divisionNameMap: Record<string, string> = {
        uiux: "UI/UX",
        frontend: "Frontend",
        backend: "Backend",
        devops: "DevOps",
      };
      const canonicalDivisionName = divisionNameMap[division_id] || division_id;
      const response = await apiClient.register({
        email,
        password,
        full_name: fullName,
        division_id: canonicalDivisionName, // send canonical text to match backend's FK (type text)
        division_name: canonicalDivisionName,
        angkatan,
      });

      if (response.success) {
        router.push("/login");
      } else {
        setError(response.error || "Register gagal");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Register gagal";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="division">Divisi</Label>
        <Select value={division_id} onValueChange={setDivision}>
          <SelectTrigger>
            <SelectValue placeholder="Divisi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="backend">Backend</SelectItem>
            <SelectItem value="devops">DevOps</SelectItem>
            <SelectItem value="uiux">UI/UX</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="angkatan">Angkatan</Label>
        <Select
          value={angkatan.toString()}
          onValueChange={(value) => setAngkatan(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Angkatan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            placeholder="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreeToTerms}
          onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm font-normal">
          I agree to the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms & Condition
          </a>
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
