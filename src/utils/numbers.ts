export function convertArabicToWestern(str: string): string {
    const arabicNumerals = "٠١٢٣٤٥٦٧٨٩";
    return str.replace(/[٠-٩]/g, (d) => arabicNumerals.indexOf(d).toString());
  }
  
  export function isArabicNumber(str: string): boolean {
    return /[٠-٩]/.test(str);
  }
  
  export function convertWesternToArabic(str: string): string {
    const arabicNumerals = "٠١٢٣٤٥٦٧٨٩";
    return str.replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
  }
  