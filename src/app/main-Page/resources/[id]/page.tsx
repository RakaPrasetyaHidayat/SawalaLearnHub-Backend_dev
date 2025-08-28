"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ThumbsUp, FileText, ExternalLink, Download } from 'lucide-react'

// Types
type ResourceBase = {
  id: string
  title: string
  author: string
  role: string
  description: string
  date: string
  likes: string
}

type LinkResource = ResourceBase & {
  type: 'link'
  link: string
  fileName: null
  fileUrl: null
}

type FileResource = ResourceBase & {
  type: 'file'
  link: null
  fileName: string
  fileUrl: string
}

type Resource = LinkResource | FileResource

// Mock data for resources - in real app this would come from API
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Wireframe Aplikasi Kasir Menggunakan Figma',
    author: 'Bimo',
    role: 'UI/UX Intern',
    description:
      'Halo teman-teman! disini aku Bimo sebagaimana yang kalian ketahui, aku sedang magang di divisi UI/UX di perusahaan ini. Aku membuat wireframe kasir menggunakan Figma, kali ini akan aku paparkan seperti apa hasil dari wireframe tersebut :',
    date: '12 Oct 2025',
    likes: '200k',
    type: 'link',
    link:
      'https://www.figma.com/design/VsXAK2SRo2JTgWm9FdOEHH/Ideation-Project-Intern-%E2%80%93-Sawala-LearnHub?node-id=720-2848&t=pK9yeMpbVygORxzJ-0',
    fileName: null,
    fileUrl: null,
  },
  {
    id: '2',
    title: 'Tutorial Responsive Web Design',
    author: 'Bimo',
    role: 'UI/UX Intern',
    description:
      'Tutorial lengkap tentang responsive web design dengan contoh praktis dan best practices untuk developer.',
    date: '12 Oct 2025',
    likes: '150k',
    type: 'file',
    link: null,
    fileName: 'Tutorial-Responsive-Web-Design.pdf',
    fileUrl: '/assets/documents/tutorial-responsive-web-design.pdf',
  },
]

export default function ResourceDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchResource = () => {
      const foundResource = mockResources.find((r) => r.id === params.id)
      if (foundResource) {
        setResource(foundResource)
      }
      setLoading(false)
    }

    fetchResource()
  }, [params.id])

  const handleBack = () => {
    router.back()
  }

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleFileDownload = (fileName: string, fileUrl: string) => {
    // In real app, this would trigger actual file download
    console.log(`Downloading ${fileName} from ${fileUrl}`)
    // You can implement actual download logic here
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Resource not found</div>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-700"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white px-4 py-3 flex items-center gap-3">
        <button
          onClick={handleBack}
          className=" hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Resources</h1>
      </div>

      {/* Resource Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {resource.title}
        </h1>

        {/* Metadata */}
        <div className="flex items-center mb-6">
          <span className="text-sm pr-3 text-gray-600">{resource.date}</span>
          <div className="flex items-center gap-1 text-blue-600">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm font-medium">{resource.likes}</span>
          </div>
        </div>

        {/* Author Info */}
        <div className="mb-6">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{resource.author}</span>
            {resource.role && (
              <span className="text-gray-500"> ({resource.role})</span>
            )}
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Link or File Attachment */}
        {resource.type === 'link' && resource.link && (
          <div className="mb-6">
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium break-all"
              onClick={() => handleLinkClick(resource.link)}
            >
              <ExternalLink className="h-4 w-4" />
              {resource.link}
            </a>
          </div>
        )}

        {resource.type === 'file' && resource.fileName && (
          <div className="mb-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {resource.fileName}
                  </p>
                  <p className="text-sm text-gray-500">Click to download</p>
                </div>
                <button
                  onClick={() => handleFileDownload(resource.fileName, resource.fileUrl)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

    
      </div>
    </div>
  )
}
