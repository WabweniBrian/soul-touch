import { cn } from "@/lib/utils";
import { BubbleMenu, Editor } from "@tiptap/react";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import Headings from "./headings";
import LinkInput from "./link-input";
import AlignMenu from "./align-menu";
import { BiParagraph } from "react-icons/bi";
import Tooltip from "../tooltip";

const EditorBubbleMenu = ({ editor }: { editor: Editor }) => {
  return (
    <>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="rounded-lg border bg-white p-1 shadow-md dark:bg-gray-900"
        >
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
          <LinkInput editor={editor} />
          <Headings editor={editor} />
          <AlignMenu editor={editor} />
        </BubbleMenu>
      )}
    </>
  );
};

export default EditorBubbleMenu;
