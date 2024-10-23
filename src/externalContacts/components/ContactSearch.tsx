import { useDebounce } from "@uidotdev/usehooks";
import { memo, useCallback, useEffect, useState } from "react";

import "./ContactSearch.css";

export interface ContactSearchProps {
  onSearchChange: (searchTerm: string) => void;
  onPageChange: (page: number) => void;
}

export const ContactSearch = memo(
  ({ onSearchChange, onPageChange }: ContactSearchProps) => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const debouncedSearchTerm = useDebounce(search, 300).trim();
    const debouncedPage = useDebounce(page, 300);

    useEffect(() => {
      onSearchChange(debouncedSearchTerm);
    }, [debouncedSearchTerm, onSearchChange]);

    useEffect(() => {
      onPageChange(debouncedPage);
    }, [onPageChange, debouncedPage]);

    const handleSearchChange = useCallback(
      (ev: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(ev.target.value);
      },
      []
    );

    const handlePageChange = useCallback(
      (ev: React.ChangeEvent<HTMLInputElement>) => {
        setPage(Number(ev.target.value));
      },
      []
    );

    return (
      <div className="contactSearchWrapper">
        <label htmlFor="searchBox">Search </label>
        <input
          id="searchbox"
          type="text"
          value={search}
          onChange={handleSearchChange}
        />

        <label htmlFor="pagesizebox">Page </label>
        <input
          id="pagebox"
          onChange={handlePageChange}
          value={page}
          type="number"
          min="1"
          max="100"
        />
      </div>
    );
  }
);

ContactSearch.displayName = "ContactSearch";
