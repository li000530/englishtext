import {
  RiThumbUpLine,
  RiThumbDownLine,
  RiEyeOffLine, // 引入模糊图标
  RiPlayLine, // 引入播放按钮图标
} from 'react-icons/ri';
import { Button } from '@nextui-org/button'; // 引入 NextUI 按钮组件
import { useAppStore } from '@/zustand/store'; // 使用 Zustand 获取应用状态
import { useRef, useState, useEffect } from 'react'; // 引入 React 钩子
import { Avatar } from '@nextui-org/avatar'; // 引入 NextUI 头像组件
import Image from 'next/image'; // 引入 Next.js 的 Image 组件
import realCharSVG from '@/assets/svgs/realchar.svg'; // 引入用户头像 SVG

export default function Chat() { // 定义 Chat 组件
  const { chatContent, interimChat, character } = useAppStore(); // 从 Zustand 中获取状态
  const messageEndRef = useRef(null); // 创建一个引用，用于滚动到底部
  const [blurred, setBlurred] = useState(true); // 使用 useState 钩子管理模糊状态

  useEffect(() => {
    messageEndRef.current.scrollIntoView({ // 当 chatContent 变化时，自动滚动到页面底部
      behavior: "smooth",
      block: 'center',
      inline: 'nearest'
    });
  }, [chatContent]); // 依赖 chatContent

  // 切换模糊状态的处理函数
  const toggleBlurred = () => {
    setBlurred((prev) => !prev); // 切换模糊状态
  };

  // 根据文本内容设置语言并播放的处理函数
  const handlePlayText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text); // 创建一个新的语音合成对象

    // 判断文本语言
    const isChinese = /[\u4e00-\u9fa5]/.test(text); // 判断是否包含中文字符
    utterance.lang = isChinese ? 'zh-CN' : 'en-US'; // 如果是中文则设置为中文，否则设置为英文

    speechSynthesis.speak(utterance); // 播放语音
  };

  return (
    <div className="flex flex-col gap-5 overflow-y-scroll min-h-25"> 
      {/* 使用 flex 布局，滚动显示聊天内容 */}
      {
        [...chatContent, interimChat].map((line) => { // 遍历聊天内容
          if (line && line.hasOwnProperty('from') && line.from === 'character') { // 角色消息
            return (
              <div
                key={line.hasOwnProperty('timestamp') ? line.timestamp : 0} 
                className="flex flex-row items-start gap-2"
              >
                <Avatar
                  src={character.image_url} // 显示角色头像
                  size="sm" // 头像大小
                  radius="sm" // 头像边角半径
                />
                <div className="flex flex-col md:flex-row self-start items-start md:items-stretch">
                  <p className={`w-fit max-w-[450px] py-2 px-5 font-light flex-none rounded-3xl md:mr-3 rounded-bl-none bg-real-blue-500/20 whitespace-pre-wrap ${blurred ? 'filter blur' : ''}`}>
                    {line.content} {/* 角色的消息内容 */}
                  </p>
                  <div className="flex items-center">
                    <Button
                      isIconOnly
                      aria-label="blur toggle"
                      radius="full"
                      variant="light"
                      className="text-white/50 hover:text-white hover:bg-button min-w-fit md:min-w-10 md:h-10"
                      onClick={toggleBlurred} // 点击按钮切换模糊状态
                    >
                      <RiEyeOffLine size="1.5em" /> {/* 模糊按钮 */}
                    </Button>
                    <Button
                      isIconOnly
                      aria-label="play text"
                      radius="full"
                      variant="light"
                      className="text-white/50 hover:text-white hover:bg-button min-w-fit md:min-w-10 md:h-10"
                      onClick={() => handlePlayText(line.content)} // 点击播放按钮播放角色消息
                    >
                      <RiPlayLine size="1.5em" /> {/* 播放按钮 */}
                    </Button>
                    <Button
                      isIconOnly
                      aria-label="thumb up"
                      radius="full"
                      variant="light"
                      className="text-white/50 hover:text-white hover:bg-button min-w-fit md:min-w-10 md:h-10"
                    >
                      <RiThumbUpLine size="1.5em" /> {/* 点赞按钮 */}
                    </Button>
                    <Button
                      isIconOnly
                      aria-label="thumb down"
                      radius="full"
                      variant="light"
                      className="text-white/50 hover:text-white hover:bg-button min-w-fit md:min-w-10 md:h-10"
                    >
                      <RiThumbDownLine size="1.5em" /> {/* 点踩按钮 */}
                    </Button>
                  </div>
                </div>
              </div>
            );
          } else if (line && line.hasOwnProperty('from') && line.from === 'user') { // 用户消息
            return (
              <div
                key={line.timestamp}
                className="flex flex-row self-end items-start gap-2"
              >
                <div className="flex flex-col md:flex-row self-end items-end md:items-stretch">
                  <p className={"w-fit max-w-[450px] py-2 px-5 font-light flex-none rounded-3xl rounded-br-none bg-real-blue-500/50 whitespace-pre-wrap"}>
                    {line.content} {/* 用户的消息内容 */}
                  </p>
                </div>
                <Image
                  src={realCharSVG} // 用户头像（SVG 图像）
                  alt="user" // 图像的替代文本
                  className="w-8 h-8 rounded-lg" // 设置图像样式
                />
              </div>
            )
          } else if (line && line.hasOwnProperty('from') && line.from === 'message') { // 系统消息
            return (
              <div
                key={line.timestamp}
                className="self-center"
              >
                <p className="text-tiny text-real-silver-500">{line.content}</p> {/* 显示系统消息 */ }
              </div>
            )
          }
        })
      }
      <div ref={messageEndRef}></div> {/* 用于滚动到底部 */ }
    </div>
  );
}