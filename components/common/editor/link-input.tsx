import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import { Check, Link, X } from "lucide-react";
import { useCallback, useState } from "react";
import Tooltip from "../tooltip";

const LinkInput = ({ editor }: { editor: Editor }) => {
  const [url, setUrl] = useState("");

  const setLink = useCallback(() => {
    const newUrl = url.trim();

    if (newUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: newUrl })
        .run();
    }
  }, [editor, url]);

  const getLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    setUrl(previousUrl);
  }, [editor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setLink();
  };

  return (
    <Popover>
      <Tooltip text="Link">
        <PopoverTrigger>
          <button
            type="button"
            className={cn(
              "cursor-pointer rounded-md p-1 hover:bg-accent",
              editor.isActive("link") && "bg-accent",
            )}
            onClick={getLink}
          >
            <Link className="h-4 w-4" />
          </button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent className="p-2">
        <div className="relative">
          <Input
            placeholder="https://example.com"
            className="h-8 pr-20"
            value={url}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter" && url) {
                handleKeyPress(event);
              }
            }}
          />
          <button
            type="button"
            className={`absolute right-8 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer rounded-full bg-green-600 text-white flex-center-center hover:bg-green-600/80 ${
              !url && "!right-[5px] cursor-not-allowed opacity-50"
            }`}
            onClick={setLink}
            disabled={!url}
          >
            <Check className="h-4 w-4" />
          </button>
          {url && (
            <button
              type="button"
              className="absolute right-[5px] top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer rounded-full bg-brand text-white flex-center-center hover:bg-brand/80"
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkInput;
