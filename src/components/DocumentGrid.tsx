import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  File, 
  Download, 
  Eye, 
  MoreVertical, 
  Tag,
  Calendar,
  Folder
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Document {
  id: string;
  title: string;
  subject: string;
  description: string;
  tags: string[];
  category: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: Date;
  file?: File;
}

interface DocumentGridProps {
  documents: Document[];
  onPreview: (document: Document) => void;
  onDownload: (document: Document) => void;
  onDelete: (id: string) => void;
}

export const DocumentGrid = ({ documents, onPreview, onDownload, onDelete }: DocumentGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    }
    return <File className="h-8 w-8 text-muted-foreground" />;
  };

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
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
        <p className="text-muted-foreground">Upload your first document to get started</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {getFileIcon(doc.fileType)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{doc.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {doc.category}
                    </Badge>
                  </div>
                  
                  {doc.subject && (
                    <p className="text-sm text-muted-foreground mb-1">{doc.subject}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(doc.uploadDate)}
                    </span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>{doc.fileName}</span>
                  </div>
                  
                  {doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{doc.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPreview(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onPreview(doc)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload(doc)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(doc.id)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((doc) => (
        <Card key={doc.id} className="hover:shadow-lg transition-all duration-200 group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {getFileIcon(doc.fileType)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onPreview(doc)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownload(doc)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(doc.id)}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="space-y-1">
              <CardTitle className="text-lg line-clamp-2 leading-tight">
                {doc.title}
              </CardTitle>
              {doc.subject && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {doc.subject}
                </p>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-4">
            {doc.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {doc.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Folder className="h-3 w-3" />
              <span>{doc.category}</span>
            </div>
            
            {doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {doc.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {doc.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{doc.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatDate(doc.uploadDate)}</span>
              <span>{formatFileSize(doc.fileSize)}</span>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onPreview(doc)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDownload(doc)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};