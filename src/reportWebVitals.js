// const reportWebVitals = onPerfEntry => {
//   if (onPerfEntry && onPerfEntry instanceof Function) {
//     import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
//       getCLS(onPerfEntry);
//       getFID(onPerfEntry);
//       getFCP(onPerfEntry);
//       getLCP(onPerfEntry);
//       getTTFB(onPerfEntry);
//     });
//   }
// };
//
// export default reportWebVitals;


import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const reportWebVitals = () => {
  const reportWebVitals = (metric) => {
    console.log("metric",metric)
    console.log(metric.name, metric.value /1000,)

  };
  getCLS(reportWebVitals); // Cumulative Layout Shift (CLS)
  getFID(reportWebVitals); // First Input Delay (FID)
  getFCP(reportWebVitals); // First Contentful Paint (FCP)
  getLCP(reportWebVitals); // Largest Contentful Paint (LCP)
  getTTFB(reportWebVitals); // Time to First Byte (TTFB)
};

export default reportWebVitals;