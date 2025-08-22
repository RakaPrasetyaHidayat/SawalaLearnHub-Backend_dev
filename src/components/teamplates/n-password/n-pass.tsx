"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/molecules/cards/card"
import { Input } from "@/components/atoms/ui/input"
import { Label } from "@/components/atoms/ui/label"
import { Button } from "@/components/atoms/ui/button"
import Image from "next/image"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "../../molecules/alert"
import { XCircle } from "lucide-react"
import BrandHeader from "@/components/molecules/brand-header"


export function Newpass() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setError("")
    alert("Password reset successfully!") // nanti bisa diganti redirect
  }

  return (
    <Card className="w-[350px] h-full relative">
      <button 
        className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors" 
        onClick={() => window.history.back()}
        aria-label="Go back"
      >
        <Image src="/assets/icons/backleft.png" alt="Back" width={24} height={24} />
      </button>
      <CardHeader className="mt-[60px] mb-[20px]">
      <BrandHeader containerClassName="mb-2" />
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Choose a strong password with at least 8 characters, including letters, numbers, and special symbols.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-100">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <CardFooter className="flex flex-col gap-4 items-center mt-4 p-0">
            <Button
              type="submit"
              className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              Reset Password
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}

export default Newpass;