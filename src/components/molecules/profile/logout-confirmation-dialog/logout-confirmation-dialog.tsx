"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/molecules/alert/alert-dialog"
import Image from "next/image"

interface LogoutConfirmationDialogProps {
  children: React.ReactNode
  onConfirm: () => void
}

export default function LogoutConfirmationDialog({ children, onConfirm }: LogoutConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[320px] sm:w-[320px] ml-[-9px]">
        <AlertDialogHeader className="items-center text-center">
          {/* <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center"> */}
            <div className="">
              <Image src="/assets/icons/log-out.png" alt="logout" width={50} height={50} />
            </div>
          
          <AlertDialogTitle className="text-base font-semibold text-gray-900">
            Are you sure you want to leave?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-3 justify-center">
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Yes
          </AlertDialogAction>
          <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors border-0">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}