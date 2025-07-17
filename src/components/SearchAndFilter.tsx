import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  Grid3X3, 
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Document } from './DocumentGrid';

interface SearchAndFilterProps {
  documents: Document[];
  onFilteredDocuments: (filtered: Document[]) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const SearchAndFilter = ({ 
  documents, 
  onFilteredDocuments, 
  viewMode, 
  onViewModeChange 
}: SearchAndFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Get unique categories and tags
  const categories = Array.from(new Set(documents.map(doc => doc.category)));
  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags)));

  // Apply filters
  const applyFilters = () => {
    let filtered = documents.filter(doc => {
      const matchesSearch = searchTerm === '' || 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === '' || doc.category === selectedCategory;
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => doc.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'size':
          comparison = a.fileSize - b.fileSize;
          break;
        case 'date':
        default:
          comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    onFilteredDocuments(filtered);
  };

  // Apply filters whenever search or filter criteria change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, selectedTags, sortBy, sortOrder, documents]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
    setSortBy('date');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents by title, subject, description, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Category
                {selectedCategory && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedCategory}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedCategory('')}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Tags
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedTags.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allTags.map(tag => (
                  <DropdownMenuItem 
                    key={tag}
                    onClick={() => toggleTag(tag)}
                  >
                    <div className="flex items-center w-full">
                      <span className="flex-1">{tag}</span>
                      {selectedTags.includes(tag) && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
                Sort by {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                Upload Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('title')}>
                Title
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('size')}>
                File Size
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Order</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSortOrder('asc')}>
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('desc')}>
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {selectedCategory}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSelectedCategory('')}
              />
            </Badge>
          )}
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              Tag: {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};