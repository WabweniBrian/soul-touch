import { Input } from "@/components/ui/input";
import { BubbleMenu, Editor } from "@tiptap/react";
import { Check, Edit2, Trash, X } from "lucide-react";
import React, { useCallback, useState } from "react";

const LinkBubble = ({ editor }: { editor: Editor }) => {
  const [editLink, setEditLink] = useState(false);
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
    setEditLink(false);
  }, [editor, url]);

  const getLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    setUrl(previousUrl);
    setEditLink(true);
  }, [editor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setLink();
      setEditLink(false);
    }
  };

  return (
    <>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="rounded-lg border bg-white p-1 shadow-md dark:bg-gray-900"
          shouldShow={() => editor.isActive("link")}
        >
          {editLink ? (
            <>
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
                    !url && "cursor-not-allowed opacity-50"
                  }`}
                  onClick={setLink}
                  disabled={!url}
                >
                  <Check className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="absolute right-[5px] top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer rounded-full bg-brand text-white flex-center-center hover:bg-brand/80"
                  onClick={() => setEditLink(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="gap-2 flex-align-center">
                <button
                  type="button"
                  className="cursor-pointer gap-2 rounded-md p-1 flex-align-center hover:bg-accent"
                  onClick={getLink}
                >
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Edit Link</span>
                </button>
                <button
                  type="button"
                  className="cursor-pointer gap-2 rounded-md p-1 text-rose-500 flex-align-center hover:bg-accent dark:text-rose-400"
                  onClick={() => editor.chain().focus().unsetLink().run()}
                >
                  <Trash className="h-4 w-4" />
                  <span className="text-sm">Remove Link</span>
                </button>
              </div>
            </>
          )}
        </BubbleMenu>
      )}
    </>
  );
};

export default LinkBubble;
