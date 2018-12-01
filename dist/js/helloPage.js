function helloPage(target = document.querySelector("body")) {
  target.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "c-home";
  const newList = document.createElement("button");
  newList.onclick = () => new List({ target, newL: true });
  newList.innerText = "New 'to do' list";
  newList.className = "c-home--new-button";
  wrapper.appendChild(newList);
  if (localStorage.getItem("list") !== null) {
    const prevs = document.createElement("select");
    prevs.onchange = ev => {
      const active = Array.from(ev.target.options).filter(e => e.selected)[0];
      // console.log(active.dataset.list.split(","));
      new List({
        target,
        defaultValue: active.dataset.list.split(","),
        nr: active.dataset.id
      });
    };
    //
    //
    prevs.onclick = ev => {
      ev.stopPropagation();
      if (prevs.className.indexOf("active") === -1)
        prevs.className += " active";
      else prevs.className = "c-home--list";
    };
    document.querySelector("body").addEventListener("click", ev => {
      prevs.className = "c-home--list";
    });
    //
    //
    const titleprev = document.createElement("option");
    titleprev.innerText = "Choose your 'to do' list";
    prevs.className = "c-home--list";
    prevs.appendChild(titleprev);
    JSON.parse(localStorage.getItem("list")).forEach((el, nr) => {
      const option = document.createElement("option");
      option.innerText = `${el.values.length} elements --- ${el.createdDate}`;
      option.value = nr;
      option.dataset.list = el.values;
      option.dataset.id = el.id;
      option.title = el.values;
      prevs.appendChild(option);
    });
    wrapper.appendChild(prevs);
  }
  target.appendChild(wrapper);
}
