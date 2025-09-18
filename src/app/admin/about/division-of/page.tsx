import Image from "next/image";
import { Suspense } from "react";
import { AllDivision } from "@/components/pages/division/all";
import BackButton from "@/components/atoms/ui/back-button";

export default function AdminAboutAllDivision() {
  const title = "all division";

  return (
    <div className="justify-center items-center h-full">
      <div className="justify-center items-center h-full flex relative">
        <div className=" items-center flex h-full relative w-[350px] max-[340px]:w-full pt-4 pb-2">
          <BackButton className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Image
              src="/assets/icons/arrow-left.png"
              alt="Back"
              width={8}
              height={8}
              style={{ width: "auto", height: "auto" }}
            />
          </BackButton>
          <h1 className="font-bold text-xl">{title}</h1>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <Suspense
          fallback={
            <div className="mt-4 text-sm text-gray-600">Loading...</div>
          }
        >
          <AllDivision />
        </Suspense>
      </div>
    </div>
  );
}
