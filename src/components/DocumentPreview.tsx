import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Calendar, 
  Tag, 
  Folder,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Document } from './DocumentGrid';

interface DocumentPreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (document: Document) => void;
}

export const DocumentPreview = ({ document, isOpen, onClose, onDownload }: DocumentPreviewProps) => {
  const [zoom, setZoom] = useState(100);

  if (!document) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderPreview = () => {
    if (document.fileType.includes('pdf')) {
      // For PDF files, we would need a PDF viewer
      return (
        <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg">
          <div className="text-center space-y-4">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-medium">PDF Preview</p>
              <p className="text-sm text-muted-foreground">
                PDF preview will be available once backend storage is integrated
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (document.fileType.includes('text')) {
      // For text files, show content if available
      return (
        <div className="h-96 bg-muted/20 rounded-lg p-4 overflow-auto">
          <div className="text-center space-y-4">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-medium">Text Document</p>
              <p className="text-sm text-muted-foreground">
                Text content preview will be available once backend storage is integrated
              </p>
            </div>
          </div>
        </div>
      );
    }

    // For Word documents and other types
    return (
      <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg">
        <div className="text-center space-y-4">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <p className="text-lg font-medium">Document Preview</p>
            <p className="text-sm text-muted-foreground">
              Preview will be available once backend storage is integrated
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{document.title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(document)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          {/* Document Preview */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="flex-1 overflow-auto" style={{ zoom: `${zoom}%` }}>
              {renderPreview()}
            </div>
          </div>

          {/* Document Details Sidebar */}
          <div className="lg:col-span-1 bg-muted/20 rounded-lg p-4 space-y-6 overflow-y-auto">
            <div>
              <h3 className="font-semibold mb-3">Document Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Uploaded</p>
                    <p className="text-muted-foreground">{formatDate(document.uploadDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Category</p>
                    <Badge variant="outline">{document.category}</Badge>
                  </div>
                </div>

                {document.subject && (
                  <div>
                    <p className="font-medium text-sm mb-1">Subject</p>
                    <p className="text-sm text-muted-foreground">{document.subject}</p>
                  </div>
                )}

                {document.description && (
                  <div>
                    <p className="font-medium text-sm mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">{document.description}</p>
                  </div>
                )}

                {document.tags.length > 0 && (
                  <div>
                    <p className="font-medium text-sm mb-2 flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {document.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">File Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File name</span>
                  <span className="font-medium break-all">{document.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File size</span>
                  <span className="font-medium">{formatFileSize(document.fileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File type</span>
                  <span className="font-medium uppercase">
                    {document.fileType.split('/').pop() || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};