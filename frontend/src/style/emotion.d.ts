import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      mainGradient: string;
      mainDark: string;
      mainLight: string;
      white: string;
      blue: string;
      lightBlue: string;
      yellow: string;
      red: string;
      gray900: string;
      gray800: string;
      gray700: string;
      gray600: string;
      gray500: string;
      gray400: string;
      gray300: string;
      gray200: string;
      gray100: string;
      gray50: string;
    };
    fontSizes: {
      h1: string;
      h2: string;
      h3: string;
      h4: string;
      h5: string;
      paragraph: string;
      s1: string;
      s2: string;
      s3: string;
      s4: string;
    };
  }
}
