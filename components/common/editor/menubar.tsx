import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from "lucide-react";
import Headings from "./headings";
import LinkInput from "./link-input";
import Tooltip from "../tooltip";
import { BiParagraph } from "react-icons/bi";
import AlignMenu from "./align-menu";
import { GrBlockQuote } from "react-icons/gr";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { FaRegFileCode } from "react-icons/fa";

export const MenuBar = ({ editor }: { editor: Editor }) => {
  return (
    <div className="flex-wrap gap-x-2 flex-align-center">
      <Tooltip text="Paragraph">
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive("paragraph") && "bg-accent",
          )}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <BiParagraph className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip text="Bold">
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive("bold") && "bg-accent",
          )}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip text="Italic">
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive("italic") && "bg-accent",
          )}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip text="Strike Through">
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive("strike") && "bg-accent",
          )}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip text="Underline">
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive("underline") && "bg-accent",
          )}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip text="Code">
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive("code") && "bg-accent",
          )}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip text="Code block">
        <button
          type="button"
          className={cn(
            "mt-1 cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive("codeBlock") && "bg-accent",
          )}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <FaRegFileCode />
        </button>
      </Tooltip>

      <div className="h-4 w-[2px] bg-accent" />
      <Headings editor={editor} />

      <div className="h-4 w-[2px] bg-accent" />
      <AlignMenu editor={editor} />
      <Tooltip text="Bullet lsit">
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive("bulletList") && "bg-accent",
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip text="Number list">
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive("orderedList") && "bg-accent",
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip text="Horizontal Line">
        <button
          type="button"
          className={cn(
            "mt-1 cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive("horizontalRule") && "bg-accent",
          )}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <TfiLayoutLineSolid />
        </button>
      </Tooltip>
      <div className="h-4 w-[2px] bg-accent" />
      <LinkInput editor={editor} />
      <Tooltip text="Blockquote">
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive("blockquote") && "bg-accent",
          )}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <GrBlockQuote />
        </button>
      </Tooltip>
    </div>
  );
};
