'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  const toolbarButtons = [
    { label: 'B', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Negrito' },
    { label: 'I', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Itálico' },
    { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), title: 'Título 2' },
    { label: 'H3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), title: 'Título 3' },
    { label: '•', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), title: 'Lista' },
    { label: '1.', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), title: 'Lista numerada' },
    { label: '❝', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), title: 'Citação' },
  ]

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-primary">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {toolbarButtons.map(btn => (
          <button
            key={btn.title}
            type="button"
            onClick={btn.action}
            title={btn.title}
            className={`px-2.5 py-1 text-sm font-medium rounded transition-colors ${
              btn.active ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-48 focus:outline-none" />
    </div>
  )
}
