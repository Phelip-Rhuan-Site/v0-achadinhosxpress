type Language = "pt" | "en" | "es" | "fr" | "de" | "zh" | "ar" | "hi"

const currencyMap: Record<Language, { currency: string; locale: string; exchangeRate: number }> = {
  pt: { currency: "BRL", locale: "pt-BR", exchangeRate: 1 }, // Base currency
  en: { currency: "USD", locale: "en-US", exchangeRate: 0.2 }, // 1 BRL = 0.20 USD
  es: { currency: "EUR", locale: "es-ES", exchangeRate: 0.18 }, // 1 BRL = 0.18 EUR
  fr: { currency: "EUR", locale: "fr-FR", exchangeRate: 0.18 }, // 1 BRL = 0.18 EUR
  de: { currency: "EUR", locale: "de-DE", exchangeRate: 0.18 }, // 1 BRL = 0.18 EUR
  zh: { currency: "CNY", locale: "zh-CN", exchangeRate: 1.45 }, // 1 BRL = 1.45 CNY
  ar: { currency: "SAR", locale: "ar-SA", exchangeRate: 0.75 }, // 1 BRL = 0.75 SAR
  hi: { currency: "INR", locale: "hi-IN", exchangeRate: 16.5 }, // 1 BRL = 16.50 INR
}

export function formatPrice(price: number, language: Language = "pt"): string {
  const { currency, locale, exchangeRate } = currencyMap[language]

  const convertedPrice = price * exchangeRate

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedPrice)
}
