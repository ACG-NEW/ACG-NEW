import { IPublicClientApplication, PublicClientApplication } from "@azure/msal-browser";

export const environment = {
  production: true,
  envName: 'prod',
  //------------Below API for UAT -----//
  // javaBaseUrl: "https://recon-dev.gvcgroup.prod/api",

  //------------Below API for DEV -----//

  javaBaseUrl: "https://recon-dev.gvcgroup.prod/apiev",
  version: 'DEV'
};

// export function MSALInstanceFactory(): IPublicClientApplication {
//   return new PublicClientApplication({
//     auth: {
//       // clientId: "c89f0936-75cd-480b-b6fe-fda43d3365e1",
//       // authority: "https://login.microsoftonline.com/60c43c0a-64ac-4050-bf3e-31e1cdfffdeb",
//       // redirectUri: 'https://recon-dev.gvcgroup.prod/irec'

//       //------------Above Credentilas for UAT -----//

//       //------------Below Credentilas for DEV -----//

//       clientId: "07545663-aaed-4a47-86a8-184df6b69ed5",
//       authority: "https://login.microsoftonline.com/60c43c0a-64ac-4050-bf3e-31e1cdfffdeb",
//       redirectUri: 'https://recon-dev.gvcgroup.prod/irecdev'
//     },
//     cache: {
//       cacheLocation: 'localStorage', // You can also use 'sessionStorage' or 'memoryStorage'
//       storeAuthStateInCookie: false, // Set to true if you want to store auth state in a cookie
//     },
//   });

// }

