"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { copyToClipboard } from "@/utils/copy"

interface CodeBlockProps {
  language: string
  value: string
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(value)
    if (success) {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="relative group mt-2 rounded-lg overflow-hidden">
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={handleCopy}
          className="p-1.5 sm:p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          aria-label={isCopied ? "Copied!" : "Copy code"}
        >
          {isCopied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
          codeTagProps={{
            style: {
              fontSize: "inherit",
              lineHeight: "inherit",
            },
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

