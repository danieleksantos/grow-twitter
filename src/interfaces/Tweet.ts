export interface Tweet {
  id: string
  content: string
  createdAt: string
  likesCount: number
  repliesCount: number
  user: {
    username: string
    name: string
    imageUrl: string | null
  }
}
