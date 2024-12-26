import { Button } from "@/components/ui/button";
import { useGetNoteConversationId, usePutNoteConversationId } from "@/hooks/conversation";
import { conversationIdAtom } from "@/lib/jotai";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAtom } from "jotai";
import { PlusCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const MenuBar = ({ editor }: { editor: Editor | null }) => {

    if (!editor) {
        return null;
    }

    return (
        <div className="control-group">
            <div className="button-group tiptap-menu">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleBold()
                            .run()
                    }
                    className={editor.isActive("bold") ? "is-active" : ""}
                >
                    Bold
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleItalic()
                            .run()
                    }
                    className={editor.isActive("italic") ? "is-active" : ""}
                >
                    Italic
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleStrike()
                            .run()
                    }
                    className={editor.isActive("strike") ? "is-active" : ""}
                >
                    Strike
                </button>
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={editor.isActive("paragraph") ? "is-active" : ""}
                >
                    Paragraph
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
                >
                    H3
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
                >
                    H4
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                    className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
                >
                    H5
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                    className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
                >
                    H6
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "is-active" : ""}
                >
                    Bullet list
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "is-active" : ""}
                >
                    Ordered list
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive("codeBlock") ? "is-active" : ""}
                >
                    Code block
                </button>
                <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    Horizontal rule
                </button>
            </div>
        </div>
    );
};

const ExtensionsCustom = [
    Color.configure({ types: ["textStyle"] }),
    TextStyle,
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
];

const TiptapInput = () => {
    const [conversationId] = useAtom(conversationIdAtom);
    const [contentEditor, setContentEditor] = useState("");
    const { data: notes, isSuccess } = useGetNoteConversationId(conversationId!);

    const editor = useEditor({
        extensions: ExtensionsCustom,
        editable: true,
        editorProps: {
            attributes: { class: "prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc focus:outline-none focus:shadow-outline break-all" }
        },
        onUpdate: ({ editor }) => {
            setContentEditor(editor.getHTML());
        }
    });

    useEffect(() => {
        if (editor && isSuccess) {
            editor.commands.setContent(notes.data.note);
        }
    }, [editor, notes, isSuccess, conversationId]);

    const mutationNote = usePutNoteConversationId(conversationId!);

    return (
        <div className='w-full'>
            <MenuBar editor={editor} />
            <EditorContent
                editor={editor}
            >
            </EditorContent>
            <Button
                variant={"outline"}
                className="border-regal-green mt-4 mb-20"
                onClick={() => mutationNote.mutate({ note: contentEditor })}
            >
                <PlusCircleIcon size={15} className="mr-2" /> Thêm ghi chú
            </Button>
        </div>
    );
};

export default TiptapInput;