
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const SearchAndFilters = ({ searchTerm, setSearchTerm, sortBy, setSortBy }: SearchAndFiltersProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search providers..." 
            className="pl-10 w-full" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background text-sm min-w-0 sm:min-w-[180px]"
        >
          <option value="rating">Sort by Rating</option>
          <option value="price">Sort by Price</option>
          <option value="distance">Sort by Distance</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilters;
