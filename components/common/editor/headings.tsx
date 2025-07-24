import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  ChevronsUpDown,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import Tooltip from "../tooltip";

const Headings = ({ editor }: { editor: Editor }) => {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Tooltip text="Heading">
            <button
              type="button"
              className="cursor-pointer rounded-md p-1 flex-align-center hover:bg-accent"
            >
              <Heading1 className="h-4 w-4" />
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
              editor.isActive("heading", { level: 1 }) && "bg-accent",
            )}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={cn(
              "cursor-pointer rounded-md p-1 hover:bg-accent",
              editor.isActive("heading", { level: 2 }) && "bg-accent",
            )}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            className={cn(
              "cursor-pointer rounded-md p-1 hover:bg-accent",
              editor.isActive("heading", { level: 3 }) && "bg-accent",
            )}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={cn(
              "cursor-pointer rounded-md p-1 hover:bg-accent",
              editor.isActive("heading", { level: 4 }) && "bg-accent",
            )}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            title="Heading 4"
          >
            <Heading4 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={cn(
              "cursor-pointer rounded-md p-1 hover:bg-accent",
              editor.isActive("heading", { level: 5 }) && "bg-accent",
            )}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            title="Heading 5"
          >
            <Heading5 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={cn(
              "cursor-pointer rounded-md p-1 hover:bg-accent",
              editor.isActive("heading", { level: 6 }) && "bg-accent",
            )}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            title="Heading 6"
          >
            <Heading6 className="h-4 w-4" />
          </button>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Headings;
