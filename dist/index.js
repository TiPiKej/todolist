// Function to download data to a file
function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

class List {
  constructor({ title, defaultValue, target, nr } = {}) {
    this.target = target ? target : document.querySelector("body");
    this.nr = nr === undefined ? 0 : nr;

    this.title = title ? title : "To do list";
    if (defaultValue === undefined) defaultValue = [];

    this.values = [];
    this.counter = 0;

    this.draw(this.target);
    let i = 0;
    do {
      this.addList(this.counter, defaultValue[i]);
      i++;
    } while (i < defaultValue.length);
  }

  save(type = "", overSave = false) {
    const activeValues = this.values.filter(el => el.active);

    let values = [];
    activeValues.forEach(({ value }) => values.push(value));

    if (type === "browser") {
      const date = new Date();

      let curList =
        localStorage.getItem("list") === null
          ? []
          : JSON.parse(localStorage.getItem("list"));

      if (overSave) curList[this.nr].values = values;
      else
        curList.push({
          values,
          createdDate: `${date.toDateString()}, ${date.toLocaleTimeString()}`,
          id: curList.length
        });

      localStorage.setItem("list", JSON.stringify(curList));
    }

    // console.log(values);
  }

  eventInput(e, nr) {
    let value = "";

    if (e.value !== undefined) value = e.value;
    else if (e.target.value !== undefined) value = e.target.value;

    this.values[nr] = {
      value,
      active: true
    };
  }

  removeLine({ target }, nr) {
    if (this.values.filter(e => e.active).length < 2) return false;

    if (this.values[nr] !== undefined) this.values[nr].active = false;

    target.parentNode.remove();
  }

  alert(text, storageNameNev) {
    return new Promise((res, rej) => {
      res(true);

      // const shadow = document.createElement("div");
      // shadow.className = "c-dialog--shadow";
      // const dialog = document.createElement("div");
      // dialog.className = "c-dialog--dialog";

      // const title = document.createElement("p");
      // title.className = "c-dialog--title";
      // title.innerText = text;
      // dialog.appendChild(title);

      // const yes = document.createElement("button");
      // yes.innerText = "Yes, I'm sure!";
      // yes.onclick = () => {
      //   shadow.remove();
      //   res(true);
      // };
      // dialog.appendChild(yes);

      // const nope = document.createElement("button");
      // nope.innerText = "No, how this is happend!";
      // nope.onclick = () => {
      //   shadow.remove();
      //   res(false);
      // };
      // dialog.appendChild(nope);

      // shadow.appendChild(dialog);

      // document.querySelector("body").appendChild(shadow);

      // if (storageNameNev !== undefined)
      //   localStorage.setItem(storageNameNev, true);
    });
  }

  removeList() {
    this.alert("Do you really want to delete this list?").then(e => {
      if (!e) return false;
      let todel = JSON.parse(localStorage.getItem("list"));
      delete todel[this.nr];
      let afterdel = [];

      todel.forEach(el => {
        afterdel.push({
          values: el.values,
          createdDate: el.createdDate,
          id: afterdel.length
        });
      });

      if (afterdel.length === 0) localStorage.removeItem("list");
      else localStorage.setItem("list", JSON.stringify(afterdel));

      // console.log(todel);
      helloPage(this.target);
    });
  }

  draw(target) {
    target.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "c-to-do-list";

    const title = document.createElement("p");
    title.className = "c-to-do-list--title";
    title.innerText = this.title;

    this.linesWrapper = document.createElement("div");
    this.linesWrapper.className = "c-to-do-list--all-lines-wrapper";

    const endButtons = document.createElement("div");
    endButtons.className = "c-to-do-list--end-buttons";

    const saveBrowser = document.createElement("button");
    saveBrowser.className = "c-to-do-list--end-buttons--browser-button";
    saveBrowser.innerText = "Save to browser storage";
    saveBrowser.addEventListener("click", () => {
      if (this.nr !== null) {
        this.alert("Do you want to oversave your list?").then(e => {
          if (e) this.save("browser");
        });
      } else this.save("browser");
    });

    const backToMainMenu = document.createElement("button");
    backToMainMenu.className = "c-to-do-list--end-buttons--back-button";
    backToMainMenu.innerText = "Back to main menu";
    backToMainMenu.addEventListener("click", () => {
      helloPage(this.target);
      // if (localStorage.getItem("dnakagain")) helloPage(this.target);
      // else
      //   this.alert(
      //     "Do you want to save your list to browser storage?",
      //     "dnakagain"
      //   ).then(e => {
      //     if (e) this.save("browser", true);
      //     helloPage(this.target);
      //   });
    });

    const removeList = document.createElement("button");
    removeList.className = "c-to-do-list--end-buttons--remove-button";
    removeList.innerText = "Remove 'to do' list";
    removeList.addEventListener("click", () => this.removeList());

    const saveDownload = document.createElement("button");
    saveDownload.className = "c-to-do-list--end-buttons--download-button";
    saveDownload.innerText = "Save by download to your disk";
    saveDownload.addEventListener("click", () => this.save("download"));

    const addNew = document.createElement("button");
    addNew.className = "c-to-do-list--line--add-new-button";
    addNew.innerText = "Add new line";
    addNew.addEventListener("click", () => this.addList());

    wrapper.appendChild(title);
    wrapper.appendChild(this.linesWrapper);
    endButtons.appendChild(saveBrowser);
    endButtons.appendChild(backToMainMenu);
    endButtons.appendChild(removeList);
    // endButtons.appendChild(saveDownload);
    endButtons.appendChild(addNew);

    wrapper.appendChild(endButtons);

    target.appendChild(wrapper);
  }

  addList(nr = this.counter, defaultValue = "") {
    this.counter++;

    const lineWrapper = document.createElement("div");
    lineWrapper.className = "c-to-do-list--all-lines-wrapper--line-wrapper";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "c-to-do-list--all-lines-wrapper--line-wrapper--input";
    input.value = defaultValue;
    input.addEventListener("input", ev => this.eventInput(ev, nr));
    this.eventInput(input, nr);
    lineWrapper.appendChild(input);

    const removeLine = document.createElement("button");
    removeLine.className =
      "c-to-do-list--all-lines-wrapper--line-wrapper--remove-button";
    removeLine.addEventListener("click", ev => this.removeLine(ev, nr));
    lineWrapper.appendChild(removeLine);

    this.linesWrapper.appendChild(lineWrapper);
  }
}

function helloPage(target = document.querySelector("body")) {
  target.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "c-home";

  const newList = document.createElement("button");
  newList.onclick = () => new List({ target });
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

(() => {
  console.log("js file loaded");

  helloPage(document.querySelector("#root"));
})();
