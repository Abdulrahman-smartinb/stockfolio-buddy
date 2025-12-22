Setup react-i18next

Install the required packages:

```bash
npm install i18next react-i18next i18next-browser-languagedetector
# or with pnpm / yarn
# pnpm add i18next react-i18next i18next-browser-languagedetector
```

TypeScript tips (if needed):

- Ensure `resolveJsonModule` and `esModuleInterop` are enabled in `tsconfig.json` if you import JSON translation files directly.

Usage example in components:

```tsx
import { useTranslation } from "react-i18next";

export default function Example() {
  const { t, i18n } = useTranslation();
  return <div>{t("welcome")}</div>;
}
```

Change language:

```ts
i18n.changeLanguage("ar");
```

Files added:

- `src/i18n.ts` — initialization
- `src/locales/en/common.json` — sample English translations
- `src/locales/ar/common.json` — sample Arabic translations

After installing packages, run your dev server:

```bash
npm run dev
```
