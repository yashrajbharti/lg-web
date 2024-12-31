export const checkConnection = () => {
  localStorage.getItem("lgconfigs"); // get the ip, port etc configs
  return Math.random() > 0.5;
  // add real check connection logic
};
