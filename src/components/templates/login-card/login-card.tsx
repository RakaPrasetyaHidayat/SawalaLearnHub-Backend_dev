"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/molecules/cards/card"
import { Input } from "@/components/atoms/ui/input"
import { Label } from "@/components/atoms/ui/label"
import { Button } from "@/components/atoms/ui/button"
import Image from "next/image"
import { useState } from "react"
// import axios from "axios"
import { login } from "@/services/api"
// import { getUsers } from "@/src/services/api"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "../../molecules/alert/alert"
import { XCircle } from "lucide-react"
import BrandHeader from "@/components/molecules/brand-header"

export function LoginCard() {

  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Simulasi database user
  // const registeredUsers = [
  //   { email: "admin@example.com", password: "123456" },
  //   { email: "user@example.com", password: "password" }
  // ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      if (data?.success) {
        router.push("/main-Page");
      } else {
        setError(data?.message || "Email atau password salah!");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const message = err instanceof Error ? (err.message || "Terjadi kesalahan saat login.") : "Terjadi kesalahan saat login."
      setError(message);
    }
  }

  return (
    <Card className="w-[360px] h-full relative">
      <CardHeader className="mt-[30px] mb-[20px]">
        <BrandHeader containerClassName="mb-2" />
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Sign in to access your account and manage your preferences.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-100">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <a
                href="/login/forgotpassword"
                className="hover:underline flex justify-end text-blue-600"
              >
                forgot password?
              </a>
            </div>
          </div>

          <CardFooter className="flex flex-col gap-4 items-center mt-4 p-0">
            <Button
              type="submit"
              className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              Masuk
            </Button>

            <div className="flex items-center w-full">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-sm text-gray-500">Or Sign In with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex gap-4">
              <button className="p-2 rounded-full border hover:bg-gray-100">
                <Image src="/assets/icons/google.png" alt="Google" width={32} height={32} />
              </button>
              <button className="p-2 rounded-full border hover:bg-gray-100">
                <Image src="/assets/icons/github.png" alt="GitHub" width={32} height={32} />
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              Don&apos;t have Account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign Up here
              </a>
            </div>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
