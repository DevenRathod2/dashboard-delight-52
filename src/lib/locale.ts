// Lightweight locale / currency utilities backed by localStorage.

export type Currency = {
  code: string;
  symbol: string;
  name: string;
  locale: string;
};

export const CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", locale: "en-AE" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", locale: "zh-CN" },
  { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso", locale: "es-MX" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", locale: "de-CH" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", locale: "en-NZ" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", locale: "zh-HK" },
];

export type Country = {
  code: string;
  name: string;
  flag: string;
  currency: string;
  taxLabel: string;
};

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", taxLabel: "GST" },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", taxLabel: "Sales Tax" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", taxLabel: "VAT" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", currency: "AED", taxLabel: "VAT" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", currency: "SGD", taxLabel: "GST" },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", taxLabel: "GST" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", taxLabel: "GST" },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR", taxLabel: "VAT" },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR", taxLabel: "VAT" },
  { code: "ES", name: "Spain", flag: "🇪🇸", currency: "EUR", taxLabel: "VAT" },
  { code: "IT", name: "Italy", flag: "🇮🇹", currency: "EUR", taxLabel: "VAT" },
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY", taxLabel: "Tax" },
  { code: "CN", name: "China", flag: "🇨🇳", currency: "CNY", taxLabel: "VAT" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", currency: "ZAR", taxLabel: "VAT" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", currency: "BRL", taxLabel: "Tax" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", currency: "MXN", taxLabel: "IVA" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", currency: "CHF", taxLabel: "VAT" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", currency: "NZD", taxLabel: "GST" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", currency: "HKD", taxLabel: "Tax" },
];

const K_COUNTRY = "lensly.locale.country";
const K_CURRENCY = "lensly.locale.currency";
const K_INVOICE_CURRENCY = "lensly.locale.invoiceCurrency";

const safeGet = (k: string) => {
  try { return localStorage.getItem(k); } catch { return null; }
};
const safeSet = (k: string, v: string) => {
  try { localStorage.setItem(k, v); } catch { /* ignore */ }
};

export const getCountry = (): string => safeGet(K_COUNTRY) || "IN";
export const setCountry = (code: string) => safeSet(K_COUNTRY, code);

export const getCurrency = (): string => safeGet(K_CURRENCY) || "INR";
export const setCurrency = (code: string) => safeSet(K_CURRENCY, code);

export const getInvoiceCurrency = (): string =>
  safeGet(K_INVOICE_CURRENCY) || getCurrency();
export const setInvoiceCurrency = (code: string) => safeSet(K_INVOICE_CURRENCY, code);

export const findCurrency = (code: string): Currency =>
  CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];

export const findCountry = (code: string): Country =>
  COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];

export const formatMoney = (n: number, code?: string) => {
  const cur = findCurrency(code || getCurrency());
  try {
    return new Intl.NumberFormat(cur.locale, {
      style: "currency",
      currency: cur.code,
      maximumFractionDigits: cur.code === "JPY" ? 0 : 2,
    }).format(n);
  } catch {
    return `${cur.symbol}${n.toLocaleString()}`;
  }
};
