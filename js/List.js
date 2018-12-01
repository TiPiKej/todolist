class List {
  constructor({ title, defaultValue, target, nr, newL } = {}) {
    this.target = target ? target : document.querySelector("body");
    this.nr = nr === undefined ? 0 : nr;
    this.newL = newL === undefined ? false : true;
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

    let curList =
      localStorage.getItem("list") === null
        ? []
        : JSON.parse(localStorage.getItem("list"));
    const date = new Date();
    const createdDate = `${date.toDateString()}, ${date.toLocaleTimeString()}`;
    const id = curList.length;
    const filename = `${date.getDay()}_${date.getMonth()}_${date.getFullYear()}__${date.toLocaleTimeString()}.json`;

    if (overSave) curList[this.nr].values = values;
    else
      curList.push({
        values,
        createdDate,
        id
      });

    if (type === "browser") {
      localStorage.setItem("list", JSON.stringify(curList));
    } else if (type === "downloadAll") {
      download(JSON.stringify(curList), filename, "text/json");
    } else if (type === "download") {
      download(
        JSON.stringify({
          values,
          createdDate,
          id
        }),
        filename,
        "application/json"
      );
    }
    console.log(values);
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
    endButtons.appendChild(addNew);
    endButtons.appendChild(saveBrowser);
    endButtons.appendChild(saveDownload);
    endButtons.appendChild(backToMainMenu);
    if (!this.newL) endButtons.appendChild(removeList);
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
