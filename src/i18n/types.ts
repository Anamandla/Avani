export type SupportedLanguage = 
  | 'en' // English
  | 'zu' // isiZulu
  | 'xh' // isiXhosa
  | 'af' // Afrikaans
  | 'nso' // Sepedi / Sesotho sa Leboa
  | 'tn' // Setswana
  | 'st' // Sesotho
  | 'ts' // Xitsonga
  | 'ss' // siSwati
  | 've' // Tshivenḓa
  | 'nr'; // isiNdebele

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  greeting: string;
  region: string;
}

export const SOUTH_AFRICAN_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    greeting: 'Good day',
    region: 'National / Official'
  },
  {
    code: 'zu',
    name: 'isiZulu',
    nativeName: 'isiZulu',
    greeting: 'Sawubona',
    region: 'KwaZulu-Natal, Gauteng, Mpumalanga'
  },
  {
    code: 'xh',
    name: 'isiXhosa',
    nativeName: 'isiXhosa',
    greeting: 'Molo',
    region: 'Eastern Cape, Western Cape, Gauteng'
  },
  {
    code: 'af',
    name: 'Afrikaans',
    nativeName: 'Afrikaans',
    greeting: 'Goeiedag',
    region: 'Western Cape, Northern Cape, Gauteng'
  },
  {
    code: 'nso',
    name: 'Sepedi',
    nativeName: 'Sesotho sa Leboa',
    greeting: 'Thobela',
    region: 'Limpopo, Gauteng, Mpumalanga'
  },
  {
    code: 'tn',
    name: 'Setswana',
    nativeName: 'Setswana',
    greeting: 'Dumela',
    region: 'North West, Northern Cape, Gauteng'
  },
  {
    code: 'st',
    name: 'Sesotho',
    nativeName: 'Sesotho',
    greeting: 'Dumela',
    region: 'Free State, Gauteng'
  },
  {
    code: 'ts',
    name: 'Xitsonga',
    nativeName: 'Xitsonga',
    greeting: 'Avuxeni',
    region: 'Limpopo, Mpumalanga, Gauteng'
  },
  {
    code: 'ss',
    name: 'siSwati',
    nativeName: 'siSwati',
    greeting: 'Sawubona',
    region: 'Mpumalanga, Gauteng'
  },
  {
    code: 've',
    name: 'Tshivenḓa',
    nativeName: 'Tshivenḓa',
    greeting: 'Ndaa / Aa',
    region: 'Limpopo, Gauteng'
  },
  {
    code: 'nr',
    name: 'isiNdebele',
    nativeName: 'isiNdebele',
    greeting: 'Lotjha',
    region: 'Mpumalanga, Gauteng'
  }
];

export type TranslationKey = string;
