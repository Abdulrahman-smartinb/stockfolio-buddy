import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

const MultiTagSelect = ({
  options = [],
  selectedTags = [],
  onChange,
  placeholder = "Select tags",
  error = false,
  isRtl = false,
  noOptionsText = "No tags found",
  searchPlaceholder = "Search tags...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const getTagId = (tag) => tag?.id || tag?._id || "";
  const getTagName = (tag) => {
    if (!tag) return "";
    return isRtl
      ? tag?.nameAr || tag?.name || ""
      : tag?.name || tag?.nameAr || "";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return options;

    return options.filter((option) =>
      getTagName(option).toLowerCase().includes(term),
    );
  }, [options, searchTerm, isRtl]);

  const isSelected = (tag) =>
    selectedTags.some((t) => getTagId(t) === getTagId(tag));

  const handleTagToggle = (tag) => {
    const exists = isSelected(tag);

    const newTags = exists
      ? selectedTags.filter((t) => getTagId(t) !== getTagId(tag))
      : [...selectedTags, tag];

    onChange(newTags);
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tag, e) => {
    e?.stopPropagation();
    onChange(selectedTags.filter((t) => getTagId(t) !== getTagId(tag)));
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        onClick={handleOpen}
        className={`min-h-[48px] w-full rounded-2xl border bg-background px-3 py-2 transition cursor-text ${
          error
            ? "border-red-500 ring-1 ring-red-500/20"
            : "border-input hover:border-primary/40 focus-within:border-primary"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {selectedTags.map((tag) => (
            <span
              key={getTagId(tag)}
              className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              <span className="max-w-[140px] truncate">{getTagName(tag)}</span>
              <button
                type="button"
                onClick={(e) => handleRemoveTag(tag, e)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary/15"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          <div className="flex min-w-[120px] flex-1 items-center gap-2">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={
                selectedTags.length ? searchPlaceholder : placeholder
              }
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
              if (!isOpen) {
                setTimeout(() => inputRef.current?.focus(), 0);
              }
            }}
            className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted"
          >
            <ChevronDown
              size={16}
              className={`text-muted-foreground transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          <div className="max-h-64 overflow-y-auto py-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const active = isSelected(option);

                return (
                  <button
                    key={getTagId(option)}
                    type="button"
                    onClick={() => handleTagToggle(option)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-muted ${
                      active ? "bg-primary/10 text-primary" : "text-foreground"
                    }`}
                  >
                    <span className="truncate">{getTagName(option)}</span>
                    {active && <span className="text-xs font-medium">✓</span>}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                {noOptionsText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiTagSelect;
