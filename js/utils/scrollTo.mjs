export const scrollToPage = (id) => {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
};
