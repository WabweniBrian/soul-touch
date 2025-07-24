import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronsUpDown,
} from "lucide-react";
import Tooltip from "../tooltip";

const AlignMenu = ({ editor }: { editor: Editor }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Tooltip text="Alignment">
          <button
            type="button"
            className="cursor-pointer rounded-md p-1 flex-align-center hover:bg-accent"
          >
            <AlignLeft className="h-4 w-4" />
            <span className="ml-1">
              <ChevronsUpDown className="h-3 w-3" />
            </span>
          </button>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent className="flex w-10 flex-col p-2">
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive({ textAlign: "center" }) && "bg-accent",
          )}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive({ textAlign: "left" }) && "bg-accent",
          )}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive({ textAlign: "right" }) && "bg-accent",
          )}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align right"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          className={cn(
            "cursor-pointer rounded-md p-1 hover:bg-accent",
            editor.isActive({ textAlign: "justify" }) && "bg-accent",
          )}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          title="Align justify"
        >
          <AlignJustify className="h-4 w-4" />
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default AlignMenu;
