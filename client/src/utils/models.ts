export interface MessageModel {
    author: Author
    content: string
}

export interface Author {
    rgbColor: string
    userName: string
}