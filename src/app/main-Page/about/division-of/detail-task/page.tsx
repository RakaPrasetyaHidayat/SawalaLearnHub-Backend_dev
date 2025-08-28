import Image from "next/image"
import TaskDetail from "@/components/organisms/task-detail/task-detail"
import BackButton from "@/components/atoms/ui/back-button"

export default function DetailTaskPage() {
  return (
    <div className='justify-center items-center h-full'>
      <div className="justify-center items-center h-full flex relative">
        <div className=" items-center flex h-full relative w-[350px] max-[340px]:w-full pt-4 pb-2">
          <BackButton className="ml-2 p-2 rounded-full">
            <Image src="/assets/icons/arrow-left.png" alt="Back" width={8} height={8} style={{ width: 'auto', height: 'auto' }} />
          </BackButton>
          <h1 className='font-bold text-xl'>Detail Task</h1>
        </div>
      </div>

      <div className='space-y-3 p-4'>
        <TaskDetail
          title="Pre Test 1 for All Intern"
          deadline="14 Aug 2024, 18:00"
          description="This pre-test evaluates the foundational knowledge of UI/UX design principles, including user-centered design, wireframing, visual hierarchy, and basic tools. It helps assess the intern's readiness for hands-on design tasks."
        />
      </div>
    </div>
  )
}

