import { useState, useRef, useEffect, useCallback } from 'react'
import { useUnifiedMemoryStore } from '../../stores/useUnifiedMemoryStore'

interface ChatMessage {
  id: string
  speaker: 'user' | 'ai'
  text: string
  timestamp: number
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      speaker: 'ai',
      text: '嗨，主人～我是 loona，有什么想和我聊的吗？',
      timestamp: Date.now(),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const addFromConversation = useUnifiedMemoryStore((s) => s.addFromConversation)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, scrollToBottom])

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onend = () => {
      setIsRecording(false)
      setIsListening(false)
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setInputText((prev) => prev + finalTranscript)
      } else if (interimTranscript) {
        setInputText((prev) => {
          const base = prev.replace(/\[录音中.*?\]$/, '')
          return base + '[录音中：' + interimTranscript + ']'
        })
      }
    }

    recognition.onerror = (_event: any) => {
      setIsRecording(false)
      setIsListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  const handleSend = useCallback(() => {
    const text = inputText.replace(/\[录音中.*?\]$/, '').trim()
    if (!text) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      speaker: 'user',
      text,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText('')

    // Save to short-term memory
    addFromConversation(text)

    // Simulate AI reply after a short delay
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        speaker: 'ai',
        text: generateAIReply(text),
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiReply])
    }, 600)
  }, [inputText, addFromConversation])

  const handleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      alert('您的浏览器不支持语音输入，请使用文字输入～')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setInputText('')
      setIsListening(true)
      recognitionRef.current.start()
    }
  }, [isListening])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Check for ascend trigger keywords
  useEffect(() => {
    const lastMsg = messages[messages.length - 1]
    if (!lastMsg || lastMsg.speaker !== 'user') return

    const triggerWords = ['存到长期记忆', '记住这件事', '飞升']
    const hasTrigger = triggerWords.some((w) => lastMsg.text.includes(w))

    if (hasTrigger) {
      // Trigger ascension after a brief delay
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          speaker: 'ai',
          text: '好的主人，我这就把这段对话珍藏到星空里 ✨',
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, aiMsg])
        // The actual ascend will be handled by the parent component
        window.dispatchEvent(new CustomEvent('trigger-ascension'))
      }, 400)
    }
  }, [messages])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          fontSize: 22,
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.4)'
        }}
      >
        💬
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 320,
        height: 420,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(20, 20, 35, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: 20,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            🌙
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>loona</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>在线</div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: 20,
            cursor: 'pointer',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none'
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.speaker === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: msg.speaker === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background:
                msg.speaker === 'user'
                  ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
                  : 'rgba(255,255,255,0.08)',
              color: msg.speaker === 'user' ? '#fff' : '#e2e8f0',
              fontSize: 13,
              lineHeight: 1.5,
              wordBreak: 'break-word',
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: '10px 14px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleVoiceInput}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: 'none',
            background: isRecording
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'rgba(255,255,255,0.1)',
            color: isRecording ? '#fff' : '#94a3b8',
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
          title={isRecording ? '点击停止录音' : '语音输入'}
        >
          {isRecording ? '⏹' : '🎤'}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="和 loona 聊聊..."
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 18,
            padding: '8px 14px',
            color: '#f8fafc',
            fontSize: 13,
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)'
          }}
        />

        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: 'none',
            background: inputText.trim()
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              : 'rgba(255,255,255,0.05)',
            color: inputText.trim() ? '#fff' : '#64748b',
            fontSize: 16,
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          ➤
        </button>
      </div>
    </div>
  )
}

function generateAIReply(userText: string): string {
  const lower = userText.toLowerCase()

  if (lower.includes('你好') || lower.includes('嗨') || lower.includes('hi')) {
    return '你好呀主人～今天过得怎么样？'
  }
  if (lower.includes('累') || lower.includes('困') || lower.includes('疲惫')) {
    return '辛苦啦主人，要不要休息一下？我可以陪你聊聊天放松心情～'
  }
  if (lower.includes('开心') || lower.includes('高兴') || lower.includes('快乐')) {
    return '太好了！主人的快乐就是我的快乐 🌟 可以分享给我听听吗？'
  }
  if (lower.includes('难过') || lower.includes('伤心') || lower.includes('不开心')) {
    return '抱抱主人... 不管发生什么，我都会在这里陪着你的 💜'
  }
  if (lower.includes('晚安') || lower.includes('睡觉')) {
    return '晚安主人～做个好梦，明天见 🌙'
  }
  if (lower.includes('早安') || lower.includes('早上好')) {
    return '早安主人！新的一天开始了，要元气满满哦 ☀️'
  }
  if (lower.includes('星空') || lower.includes('星星')) {
    return '星空里藏着我们好多回忆呢～要不要切换到星空看看？'
  }
  if (lower.includes('存到长期记忆') || lower.includes('记住') || lower.includes('飞升')) {
    return '' // handled separately
  }

  const defaults = [
    '嗯嗯，我在听呢～',
    '这样呀，主人说得很有趣呢',
    '我明白了，然后呢？',
    '哇，真的吗？',
    '主人想聊聊别的吗？',
  ]
  return defaults[Math.floor(Math.random() * defaults.length)]
}
