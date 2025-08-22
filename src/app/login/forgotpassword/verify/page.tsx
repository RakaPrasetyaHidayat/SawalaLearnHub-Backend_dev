import Verify from '@/components/teamplates/verify/verify'
import React, { Suspense } from 'react'

function VerifyPage() {
  return (
    <div className='flex justify-center items-center h-screen'>
        <Suspense fallback={<div />}> 
            <Verify />
        </Suspense>
    </div>
  )
}

export default VerifyPage   