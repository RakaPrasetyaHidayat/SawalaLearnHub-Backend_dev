"use client"

import Image from "next/image"

export function SocialLogin() {
  const handleGoogleLogin = () => {
    // Handle Google login
    console.log("Google login clicked")
  }

  const handleGitHubLogin = () => {
    // Handle GitHub login
    console.log("GitHub login clicked")
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <Image 
            src="/assets/icons/google.png" 
            alt="Google" 
            width={24} 
            height={24}
            className="w-6 h-6"
          />
        </button>
        <button
          type="button"
          onClick={handleGitHubLogin}
          className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <Image 
            src="/assets/icons/github.png" 
            alt="GitHub" 
            width={24} 
            height={24}
            className="w-6 h-6"
          />
        </button>
      </div>
    </div>
  )
}