"use client";

import { cn } from "@/lib/utils";
import Blockquote from "@tiptap/extension-blockquote";
import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import { Dispatch, SetStateAction } from "react";
import BubbleEditorMenu from "./bubble-menu";
import LinkBubble from "./link-bubble";
import { MenuBar } from "./menubar";
import "highlight.js/styles/github-dark.css";

interface TextEditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  minHeight?: string;
  placeholder?: string;
}

const TextEditor = ({
  content,
  setContent,
  minHeight = "min-h-[300px]",
  placeholder = "Type your content here...",
}: TextEditorProps) => {
  const lowlight = createLowlight(common);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Highlight,
      Underline,
      Link.configure({
        HTMLAttributes: {
          class: "text-brand underline",
        },
        openOnClick: false,
      }),
      Code.configure({
        HTMLAttributes: {
          class: "bg-accent border px-1 rounded",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "not-prose p-3 bg-accent/60 border rounded-lg",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class:
            "ml-4 border-l-2 text-lg italic text-muted-foreground pl-2 my-2",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("relative rounded-xl border shadow-sm", minHeight)}>
      {/* Bubble Menu */}
      <BubbleEditorMenu editor={editor} />

      {/* Link Bubble Menu */}
      <LinkBubble editor={editor} />

      {/* Normal Menu */}
      <div className="border-b px-1 py-1">
        <MenuBar editor={editor} />
      </div>

      <div className="tiptap p-4">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
};

export default TextEditor;
