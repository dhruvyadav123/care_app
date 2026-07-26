import React, { useMemo, useState } from "react";
import { Search, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import { getMenuItemsByRole } from "../../Sidebar/Menu";
import { getStoredUserRole } from "../../../Utils/authRole";

const flattenMenuItems = (items = [], inheritedIcon = "home") =>
  items.flatMap((item) => {
    const icon = item?.icon || inheritedIcon;
    const currentItem =
      item?.type === "link" && item?.path
        ? [
            {
              title: item.title,
              path: item.path,
              icon,
            },
          ]
        : [];
    const childItems = Array.isArray(item?.children)
      ? flattenMenuItems(item.children, icon)
      : [];

    return [...currentItem, ...childItems];
  });

const Searchbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const role = getStoredUserRole();

  const searchableItems = useMemo(() => {
    const menuGroups = getMenuItemsByRole(role);

    return menuGroups.flatMap((group) => flattenMenuItems(group?.Items || []));
  }, [role]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return searchableItems
      .filter((item) => String(item?.title || "").toLowerCase().includes(normalizedQuery))
      .slice(0, 8);
  }, [query, searchableItems]);

  const handleNavigate = (item) => {
    if (!item?.path) {
      return;
    }

    navigate(item.path);
    setQuery("");
    setIsFocused(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && results.length > 0) {
      event.preventDefault();
      handleNavigate(results[0]);
    }

    if (event.key === "Escape") {
      setQuery("");
      setIsFocused(false);
      event.currentTarget.blur();
    }
  };

  const showResults = isFocused && Boolean(query.trim());

  return (
    <li
      className="header-search-nav"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="header-search-control">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          role="combobox"
          value={query}
          placeholder="Search pages..."
          aria-label="Search pages"
          aria-autocomplete="list"
          aria-expanded={showResults}
          aria-controls="header-search-results"
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
        />
        {query ? (
          <button
            type="button"
            className="header-search-clear"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        ) : null}
      </div>

      {showResults ? (
        <div id="header-search-results" className="header-search-results" role="listbox">
          {results.length > 0 ? (
            results.map((item) => (
              <button
                type="button"
                className="header-search-result"
                key={item.path}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleNavigate(item)}
                role="option"
                aria-selected="false"
              >
                <Search size={14} aria-hidden="true" />
                <span>{item.title}</span>
              </button>
            ))
          ) : (
            <div className="header-search-empty">No matching page found.</div>
          )}
        </div>
      ) : null}
    </li>
  );
};

export default Searchbar;