import COUNTRY_CITY_DATA from "./countries_cities.json";

export type CountryCityItem = {
  code: string;
  name: string;
  nameAr: string;
  cities: Array<{
    name: string;
    nameAr: string;
  }>;
};

export const countryCityData = COUNTRY_CITY_DATA as CountryCityItem[];

export const findCountryByValue = (value?: string | null) => {
  if (!value) return null;

  const normalized = value.trim().toLowerCase();

  return (
    countryCityData.find(
      (country) =>
        country.code.toLowerCase() === normalized ||
        country.name.toLowerCase() === normalized ||
        country.nameAr.toLowerCase() === normalized,
    ) || null
  );
};

export const findCityByValue = (
  countryName?: string | null,
  cityValue?: string | null,
) => {
  if (!countryName || !cityValue) return null;

  const country = findCountryByValue(countryName);
  if (!country) return null;

  const normalizedCity = cityValue.trim().toLowerCase();

  return (
    country.cities.find(
      (city) =>
        city.name.toLowerCase() === normalizedCity ||
        city.nameAr.toLowerCase() === normalizedCity,
    ) || null
  );
};
