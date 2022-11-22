import { MessageModel } from '../utils/models'

type MessageProps = {
    message: MessageModel
} & React.ComponentPropsWithRef<'div'>

const ChatMessage = ({
    message: { author, content },
    className,
}: MessageProps) => {
    const Author = (
        <span className="font-semibold" style={{ color: author.rgbColor }}>
            {author.userName}
        </span>
    )

    return (
        <div className={`text-[15px] py-1 px-2 rounded hover:bg-gray-500/30 leading-6 ${className}`}>
            <div className="inline-flex items-baseline">
                {Author}
            </div>
            <span className="ml-3 break-words">{content}</span>
        </div>
    )
}
export default ChatMessage
