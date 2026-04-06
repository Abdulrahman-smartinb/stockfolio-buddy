import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";
import MultiTagSelect from "./ui/MultiTagSelect";

export type Option = {
  _id: string;
  name: string;
  nameAr?: string;
};

type Props = {
  t: (key: string) => string;
  isRtl?: boolean;
  projectSearchQuery: string;
  setProjectSearchQuery: (value: string) => void;
  selectedProjectCategory: string;
  setSelectedProjectCategory: (value: string) => void;
  selectedProjectTags: Option[];
  setSelectedProjectTags: (value: Option[]) => void;
  categories: Option[];
  tags: Option[];
  onClear: () => void;
};

type CategorySelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  searchPlaceholder: string;
  noOptionsText: string;
  isRtl?: boolean;
};

const CategorySelect = ({
  value,
  onChange,
  options = [],
  placeholder,
  searchPlaceholder,
  noOptionsText,
  isRtl = false,
}: CategorySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getOptionId = (item: Option) => item?._id || "";
  const getOptionName = (item?: Option) => {
    if (!item) return "";
    return isRtl
      ? item?.nameAr || item?.name || ""
      : item?.name || item?.nameAr || "";
  };

  const selectedOption = useMemo(
    () => options.find((item) => getOptionId(item) === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return options;

    return options.filter((option) =>
      getOptionName(option).toLowerCase().includes(term)
    );
  }, [options, searchTerm, isRtl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <button
        type="button"
        onClick={handleOpen}
        className="flex h-12 w-full items-center justify-between rounded-2xl border border-input bg-background px-4 text-sm text-foreground shadow-sm transition hover:border-primary/40 focus:border-primary"
      >
        <span
          className={`truncate ${
            !selectedOption ? "text-muted-foreground" : ""
          }`}
        >
          {selectedOption ? getOptionName(selectedOption) : placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          <div className="border-b border-border px-3 py-2">
            <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3">
              <Search size={14} className="shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto py-2">
            <button
              type="button"
              onClick={() => handleSelect("")}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-muted ${
                value === "" ? "bg-primary/10 text-primary" : "text-foreground"
              }`}
            >
              <span className="truncate">{placeholder}</span>
              {value === "" && <Check size={14} />}
            </button>

            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const active = getOptionId(option) === value;

                return (
                  <button
                    key={getOptionId(option)}
                    type="button"
                    onClick={() => handleSelect(getOptionId(option))}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-muted ${
                      active ? "bg-primary/10 text-primary" : "text-foreground"
                    }`}
                  >
                    <span className="truncate">{getOptionName(option)}</span>
                    {active && <Check size={14} />}
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

const ProjectsFilters = ({
  t,
  isRtl = false,
  selectedProjectCategory,
  setSelectedProjectCategory,
  selectedProjectTags,
  setSelectedProjectTags,
  categories,
  tags,
  onClear,
}: Props) => {
  return (
    <div
      className="w-full rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="min-w-0">
        <div className={`flex items-center justify-between gap-2 `}>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            {t("filters.filters")}
          </h2>

          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-xl border border-border bg-background px-3 text-xs sm:text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {t("filters.clear_filters")}
          </button>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("filters.filter_projects_desc")}
        </p>
      </div>

      {/* Filters */}
      <div className="mt-4 grid grid-cols-1 gap-4">
        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            {t("filters.filter_category")}
          </label>

          <CategorySelect
            value={selectedProjectCategory}
            onChange={setSelectedProjectCategory}
            options={categories}
            isRtl={isRtl}
            placeholder={t("filters.all_categories")}
            searchPlaceholder={t("filters.search_category")}
            noOptionsText={t("filters.no_category_found")}
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label className="block text-sm font-medium text-foreground">
              {t("filters.filter_tags")}
            </label>

            {!!selectedProjectTags?.length && (
              <span className="text-xs text-muted-foreground">
                {selectedProjectTags.length} {t("filters.selected")}
              </span>
            )}
          </div>

          <MultiTagSelect
            options={tags || []}
            selectedTags={selectedProjectTags}
            onChange={setSelectedProjectTags}
            isRtl={isRtl}
            placeholder={t("filters.all_tags")}
            searchPlaceholder={t("filters.search_tags")}
            noOptionsText={t("filters.no_tags_found")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectsFilters;
