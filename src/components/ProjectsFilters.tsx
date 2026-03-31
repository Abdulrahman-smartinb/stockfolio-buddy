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
  selectedProjectTags: string[];
  setSelectedProjectTags: (value: string[]) => void;
  categories: Option[];
  tags: Option[];
  onClear: () => void;
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
    <div className="rounded-3xl border border-border/60 bg-card/95 p-5 md:p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            {t("filters.filters")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("filters.filter_projects_desc")}
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-10 items-center justify-center rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          {t("filters.clear_filters")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            {t("filters.filter_category")}
          </label>

          <div className="relative">
            <select
              value={selectedProjectCategory}
              onChange={(e) => setSelectedProjectCategory(e.target.value)}
              className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary"
            >
              <option value="">{t("filters.all_categories")}</option>
              {categories?.map((category) => (
                <option key={category?._id} value={category?._id}>
                  {isRtl ? category?.nameAr : category?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2 lg:ms-2 md:ms-2">
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
