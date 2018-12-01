(() => {
  console.log("js file loaded");

  const target = document.querySelector("#root");

  helloPage(target);

  dropEvent(target);
})();
