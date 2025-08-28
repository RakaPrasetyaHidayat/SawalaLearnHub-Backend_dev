"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/molecules/cards/card"
import { Input } from "@/components/atoms/ui/input"
import { Label } from "@/components/atoms/ui/label"
import { Button } from "@/components/atoms/ui/button"
import Image from "next/image"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "../../molecules/alert/alert"
import { XCircle } from "lucide-react"
import { Checkbox } from "@/components/atoms/ui/checkbox"
import BrandHeader from "@/components/molecules/brand-header"

export function RegisterCard() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

  // Cek apakah email & password valid (contoh sederhana)
  // if (email !== "admin@example.com" || password !== "123456") {
  //   setError("Email atau password salah!")
  // } else {
  //   setError("")
  //   alert("Login berhasil!") // nanti bisa diganti dengan redirect
  // }
  }

  return (
    <Card className="w-[350px] h-full relative">
      <CardHeader className="mt-[30px] mb-[20px]">
        <BrandHeader containerClassName="mb-2" />
        <CardTitle className="text-2xl">Create New Account</CardTitle>
        <CardDescription>
          <div className="text-sm text-gray-500">
            Already have Account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign In here
            </a>
          </div>
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
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                placeholder="Username"
                type="text"
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
              <Input
                id="confirm-password"
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {/* Tampilkan error jika ada */}
            {error && (
              <Alert variant="destructive" className="bg-red-100">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <div>
              <Checkbox
                id="terms"
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label
                htmlFor="terms"
                className="ml-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Saya setuju dengan syarat & ketentuan
              </label>
            </div>
          </div>

          <CardFooter className="flex flex-col gap-4 items-center mt-4 p-0">
            <Button
              type="submit"
              className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              Daftar
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
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
