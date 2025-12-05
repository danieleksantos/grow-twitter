export interface User {
  id: string
  username: string
  name: string
  imageUrl: string
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
