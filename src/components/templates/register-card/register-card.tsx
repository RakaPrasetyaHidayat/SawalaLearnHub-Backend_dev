import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/molecules/cards/card"
import BrandHeader from "@/components/molecules/brand-header"
import { RegisterForm } from "./register-form"
import { SocialLogin } from "../../molecules/social-login/social-login"

export function RegisterCard() {
  return (
    <Card className="w-full max-w-md mx-auto pt-[100px] mt-15 relative">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-bold">Create New Account</CardTitle>
        <CardDescription className="text-base text-gray-600">
          Already have account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in here
          </a>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <RegisterForm />
        <SocialLogin />
      </CardContent>
    </Card>
  )
}