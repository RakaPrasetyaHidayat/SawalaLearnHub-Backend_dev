import PostsClient from '@/components/client/posts-client'

export default function MyPostsPage() {
  // In real app, fetch posts for current user here (server side)
  const posts = [
    {
      id: '1',
      user: { name: 'Bimo', avatar: '/assets/icons/profile.png' },
      content: 'Kehidupan itu seperti user journey penuh tikungan, bug, dan kadang error 404. Tapi tetap bisa diarahkan ke tujuan.',
      timestamp: '12:10 AM   Oct 30,2025',
      initialLikes: 200000,
      initialComments: 123000,
    },
    {
      id: '2',
      user: { name: 'Bimo', avatar: '/assets/icons/profile.png' },
      content: 'Kehidupan itu seperti user journey penuh tikungan, bug, dan kadang error 404. Tapi tetap bisa diarahkan ke tujuan.',
      file: { name: 'photo.jpg', type: 'image' as const },
      timestamp: '12:10 AM   Oct 26,2025',
      initialLikes: 200000,
      initialComments: 123000,
    },
    {
      id: '3',
      user: { name: 'Bimo', avatar: '/assets/icons/profile.png' },
      content: 'Kehidupan itu seperti user journey penuh tikungan, bug, dan kadang error 404. Tapi tetap bisa diarahkan ke tujuan.',
      file: { name: 'photo.jpg', type: 'image' as const },
      timestamp: '12:10 AM   Oct 19,2025',
      initialLikes: 200000,
      initialComments: 123000,
    },
  ]

  return <PostsClient posts={posts} />
}





