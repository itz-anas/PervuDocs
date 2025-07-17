import { useState } from 'react';
import { DocumentGrid, Document } from './DocumentGrid';
import { DocumentUpload } from './DocumentUpload';
import { DocumentPreview } from './DocumentPreview';
import { SearchAndFilter } from './SearchAndFilter';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface DigitalLibraryProps {
  accessCode: string;
  onLogout: () => void;
}

export const DigitalLibrary = ({ accessCode, onLogout }: DigitalLibraryProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  const handleUpload = (file: File, metadata: any) => {
    const newDocument: Document = {
      id: Date.now().toString(),
      title: metadata.title,
      subject: metadata.subject,
      description: metadata.description,
      tags: metadata.tags,
      category: metadata.category,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadDate: new Date(),
      file
    };

    setDocuments(prev => [newDocument, ...prev]);
  };

  const handlePreview = (document: Document) => {
    setPreviewDocument(document);
  };

  const handleDownload = (doc: Document) => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = doc.fileName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    toast({
      title: "Download started",
      description: `Downloading ${doc.fileName}`
    });
  };

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The document has been removed from your library."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-muted">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src="/logo_no_bg.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h1 className="text-xl font-heading font-semibold">PrevuDocs</h1>
                <p className="text-sm text-muted-foreground">Access Code: {accessCode}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <DocumentUpload onUpload={handleUpload} />
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <SearchAndFilter
            documents={documents}
            onFilteredDocuments={setFilteredDocuments}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <DocumentGrid
            documents={filteredDocuments.length > 0 ? filteredDocuments : documents}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </div>
      </main>


      <DocumentPreview
        document={previewDocument}
        isOpen={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
        onDownload={handleDownload}
      />
    </div>
  );
};
