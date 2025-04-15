import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { streamFromGemini, contentWritingPrompt } from "./GeminiAPI";
import { useEffect } from "react";

const insertMagicAi = (editor: BlockNoteEditor) => {
  const prevText = editor._tiptapEditor.state.doc.textBetween(
    Math.max(0, editor._tiptapEditor.state.selection.from - 5000),
    editor._tiptapEditor.state.selection.from - 1,
    "\n"
  );
  const prompt = contentWritingPrompt.replace(
    "{topic}",
    prevText || "general content topic"
  );

  streamFromGemini(prompt, editor);
};

const insertMagicItem = (editor: BlockNoteEditor) => ({
  title: "Insert Magic Text",
  onItemClick: async () => {
    insertMagicAi(editor);
  },
  aliases: ["autocomplete", "ai"],
  group: "AI",
  icon: (
    <svg
      fill="none"
      width={24}
      height={24}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      <path
        d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z"
        fill="url(#prefix__paint0_radial_980_20147)"
      />
      <defs>
        <radialGradient
          id="prefix__paint0_radial_980_20147"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"
        >
          <stop offset=".067" stop-color="#9168C0" />
          <stop offset=".343" stop-color="#5684D1" />
          <stop offset=".672" stop-color="#1BA1E3" />
        </radialGradient>
      </defs>
    </svg>
  ),
  subtext: "Continue your note with AI-generated text",
});

const getCustomSlashMenuItems = (
  editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  insertMagicItem(editor), // Add AI item first
  ...getDefaultReactSlashMenuItems(editor), // Then add other items
];

interface EditorProps {
  onEditorReady: (editor: BlockNoteEditor) => void;
}

export default function Editor({ onEditorReady }: EditorProps) {
  const editor = useCreateBlockNote();

  useEffect(() => {
    if (editor) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);
  return (
    <>
      <BlockNoteView
        editor={editor}
        slashMenu={false}
        theme={lightDefaultTheme}
      >
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            filterSuggestionItems(getCustomSlashMenuItems(editor), query)
          }
        />
      </BlockNoteView>
    </>
  );
}
