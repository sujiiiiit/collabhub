import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useState, useEffect } from "react";

interface AppProps {
  value?: Block[];
  onChange?: (blocks: Block[]) => void;
}

export default function App({ value = [], onChange }: AppProps) {
  const [blocks, setBlocks] = useState<Block[]>(value);

  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  useEffect(() => {
    if (onChange) {
      onChange(blocks);
    }
  }, [blocks, onChange]);

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      theme={lightDefaultTheme}
      onChange={() => {
        // Saves the document JSON to state.
        setBlocks(editor.document);
      }}
    />
  );
}