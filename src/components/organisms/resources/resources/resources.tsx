import { useRouter } from 'next/navigation'
import ResourceCard from "@/components/molecules/cards/resources/resource-card/resource-card"
import ResourcesHeader from "@/components/molecules/cards/resources/resource-header/resources-header"

export default function Resources() {
    const router = useRouter()
    
    return (
        <div className="mt-4 space-y-3 relative">
            <ResourcesHeader
              valueCategory="all"
              valueSort="newest"
              onChangeCategory={() => { }}
              onChangeSort={() => { }}
            />

            <ResourceCard
              title="Wireframe Aplikasi Kasir Menggunakan Figma"
              author="Bimo"
              role="UI/UX Intern"
              description="Wireframe untuk aplikasi kasir Figma..."
              date="12 Oct 2025"
              likes="200k"
              onView={() => router.push('/main-Page/resources/1')}
            />
            <ResourceCard
              iconColor="text-blue-600"
              title="Tutorial Responsive Web Design"
              author="Bimo"
              role="UI/UX Intern"
              description="Wireframe untuk aplikasi kasir Figma..."
              date="12 Oct 2025"
              likes="200k"
              onView={() => router.push('/main-Page/resources/2')}
            />
            <button
              onClick={() => router.push('/main-Page/resources/add')}
              className="fixed bottom-20 left-[58%] translate-x-[-45%] max-md:left-[80%] max-sm:translate-x-[-20%] md:right-[calc((100vw-1024px)/2+12px)] h-11 w-11 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 z-30 flex items-center justify-center"
            >
              +
            </button>
          </div>
    )
}