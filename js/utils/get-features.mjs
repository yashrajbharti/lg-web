export const getFeatures = async () => {
  const data = await fetch(
    "https://lg-web-la-fire.netlify.app/assets/Fire.geojson"
  );
  const result = await data.json();
  return result;
};
