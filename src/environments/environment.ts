
export const environment = {
  production: false,
  envName: 'local',
       javaBaseUrl: "http://183.82.4.173:8099/IREC"
      //  javaBaseUrl: "http://183.82.4.173:8099/IREC"
      // javaBaseUrl: "http://localhost:7777"
};
// function getApiUrlFromTextFile(filepath: any) {
//   const xmlhttp = new XMLHttpRequest();
//   xmlhttp.open('GET', filepath, false);
//   xmlhttp.send();
//   const apiUrls = xmlhttp.responseText.trim().split('\n').reduce((obj, pair) => {
//     const [key, value] = pair.split('=');
//     obj[key] = value;
//     return obj;
//   }, {});
//   return apiUrls['api.url'];
// }

