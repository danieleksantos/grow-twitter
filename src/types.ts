export interface User {
  id: string
  username: string
  name: string
  email: string
  imageUrl: string | null
  followersCount: number
  followingCount: number
  isFollowing: boolean
}

export interface Tweet {
  id: string
  content: string
  userId: string
  createdAt: string
  isLikedByMe: boolean
  likesCount: number
  repliesCount: number
  user: User
}
