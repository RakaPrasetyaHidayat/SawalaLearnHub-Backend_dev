'use client'
import { Button } from '@/components/atoms/ui/button'
import { Input } from '@/components/atoms/ui/input'
import { Label } from '@/components/atoms/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/molecules/cards/card'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import BrandHeader from "@/components/molecules/brand-header"
// import Otp from './otp'

function ForgotPassword() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    return (
        <Card className='w-[350px] h-[630px] relative'>
            {/* <BrandHeader containerClassName="mb-2" />  */}
            <CardHeader className='mt-[50px] mb-[20px]'>
            <BrandHeader containerClassName="mb-2" /> 
                <CardTitle className='text-2xl mt-4'>Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email to reset your password and regain access to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className='grid w-full items-center gap-4'>
                        <div className='flex flex-col space-y-1.5'>
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className='flex flex-col gap-4'>
                <Button type='button' className='w-full bg-blue-500 hover:bg-blue-600 text-white' onClick={() => router.push(`/login/forgotpassword/verify?email=${encodeURIComponent(email)}`)}>Send</Button>
                <Button type='button' className='w-full bg-transparent text-Neutral-900 hover:bg-transparent hover:text-black-600' onClick={() => router.push('/login')}> <Image src="/assets/images/arrow-left.png" alt="arrow-left" width={20} height={20} /> Back to Login</Button>
            </CardFooter>
        </Card>
    )
}

export default ForgotPassword