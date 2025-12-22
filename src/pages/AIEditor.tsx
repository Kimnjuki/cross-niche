import { Layout } from '@/components/layout/Layout';
import { AIWritingAssistant } from '@/components/ai/AIWritingAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function AIEditor() {
  const [content, setContent] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing... Use the AI assistant to enhance your content.',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleTextChange = (text: string) => {
    if (editor) {
      editor.commands.setContent(text);
      setContent(text);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            AI-Powered Editor
          </h1>
          <p className="text-muted-foreground">
            Write, edit, and enhance your content with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Editor
                </CardTitle>
                <CardDescription>
                  Rich text editor with AI-powered enhancements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <EditorContent editor={editor} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <AIWritingAssistant
              initialText={content}
              onTextChange={handleTextChange}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}



