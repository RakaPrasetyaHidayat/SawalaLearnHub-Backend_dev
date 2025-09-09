"use client";
import { Button } from "@/components/atoms/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/cards/card";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import * as OneTimePasswordField from "@radix-ui/react-one-time-password-field";
import BrandHeader from "@/components/molecules/brand-header";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/molecules/alert/alert-dialog";

function Otp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "agnialatas@email.com";
  return (
    <Card className="w-[350px] h-[630px] relative">
      <CardHeader className="mt-[50px] mb-[20px]">
        <BrandHeader containerClassName="mb-2" />
        <CardTitle className="text-2xl mt-4">verify OTP</CardTitle>
        <CardDescription>
          Wen sent an OTP to <span className="font-bold">{email}</span>
          <p>Enter it below to continue.</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 justify-center items-center">
              <OneTimePasswordField.Root className="OTPRoot">
                <OneTimePasswordField.Input className="OTPInput" />
                <OneTimePasswordField.Input className="OTPInput" />
                <OneTimePasswordField.Input className="OTPInput" />
                <OneTimePasswordField.Input className="OTPInput" />
                <OneTimePasswordField.Input className="OTPInput" />
                <OneTimePasswordField.Input className="OTPInput" />
                <OneTimePasswordField.HiddenInput />
              </OneTimePasswordField.Root>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          <AlertDialog>
            <AlertDialogTrigger>verify</AlertDialogTrigger>
            <AlertDialogContent className="w-[300px]">
              <AlertDialogHeader className="items-center justify-center">
                <Image
                  src="/assets/images/otp-succes.png"
                  alt="succes"
                  width={100}
                  height={100}
                />
                <AlertDialogTitle>Verify succes</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="justify-center items-center">
                <AlertDialogAction
                  onClick={() => router.push("/login/forgotpassword/n-pass")}
                >
                  Oke
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Button>
        <Button
          className="w-full bg-transparent text-Neutral-900 hover:bg-transparent hover:text-black-600"
          onClick={() => router.push("/login")}
        >
          {" "}
          <Image
            src="/assets/images/arrow-left.png"
            alt="arrow-left"
            width={20}
            height={20}
          />{" "}
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Otp;
