import { Button } from '@/components/atoms/ui/button'
import { Input } from '@/components/atoms/ui/input'
import { Label } from '@/components/atoms/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/molecules/cards/card'
import Image from 'next/image'
import React from 'react'

function ForgotPassword() {
    return (
        <Card className='w-[350px] h-[630px] relative'>
            <CardHeader className='mt-[80px] mb-[20px]'>
                <CardTitle className='text-2xl'>Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email to reset your password and regain access to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className='grid w-full items-center gap-4'>
                        <div className='flex flex-col space-y-1.5'>
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" placeholder="you@example.com" />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className='flex flex-col gap-4'>
                <Button className='w-full bg-blue-500 hover:bg-blue-600 text-white'>Send</Button>
                <Button className='w-full bg-transparent text-Neutral-900 hover:bg-transparent hover:text-black-600'> <Image src="/assets/images/arrow-left.png" alt="arrow-left" width={20} height={20} /> Back to Login</Button>
            </CardFooter>
        </Card>
    )
}

export default ForgotPassword