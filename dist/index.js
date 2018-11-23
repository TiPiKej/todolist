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
  constructor({ title, defaultValue, target } = {}) {
    this.title = title ? title : "To do list";
    if (defaultValue === undefined) defaultValue = [];

    this.values = [];
    this.counter = 0;

    this.draw(target ? target : document.querySelector("body"));
    let i = 0;
    do {
      this.addList(this.counter, defaultValue[i]);
      i++;
    } while (i < defaultValue.length);
  }

  save(type = "") {
    const activeValues = this.values.filter(el => el.active);

    let values = [];
    activeValues.forEach(({ value }) => values.push(value));

    if (type === "browser") {
      const date = new Date();

      let curList =
        localStorage.getItem("list") === null
          ? []
          : JSON.parse(localStorage.getItem("list"));

      curList.push({
        values,
        createdDate: `${date.toDateString()}, ${date.toLocaleTimeString()}`
      });

      localStorage.setItem("list", JSON.stringify(curList));
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

  draw(target) {
    target.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "c-to-do-list";

    const title = document.createElement("a");
    title.className = "c-to-do-list--title";
    title.innerText = this.title;

    this.linesWrapper = document.createElement("div");
    this.linesWrapper.className = "c-to-do-list--all-lines-wrapper";
    this.linesWrapper.appendChild(title);
    wrapper.appendChild(this.linesWrapper);

    const endButtons = document.createElement("div");
    endButtons.className = "c-to-do-list--end-buttons";

    const saveBrowser = document.createElement("button");
    saveBrowser.className = "c-to-do-list--end-buttons--browser-button";
    saveBrowser.innerText = "Save to browser storage";
    saveBrowser.addEventListener("click", () => this.save("browser"));
    endButtons.appendChild(saveBrowser);

    const backToMainMenu = document.createElement("button");
    backToMainMenu.className = "c-to-do-list--end-buttons--back-button";
    backToMainMenu.innerText = "Back to main menu";
    backToMainMenu.addEventListener("click", () => helloPage(target));
    endButtons.appendChild(backToMainMenu);

    // const saveDownload = document.createElement('button');
    // saveDownload.className = 'c-to-do-list--end-buttons--download-button';
    // saveDownload.innerText = 'Save by download to your disk';
    // saveDownload.addEventListener('click', () => this.save('download'));
    // endButtons.appendChild(saveDownload);

    wrapper.appendChild(endButtons);

    target.appendChild(wrapper);
  }

  addList(nr = this.counter, defaultValue = "") {
    this.counter++;

    const lineWrapper = document.createElement("div");
    lineWrapper.className = "c-to-do-list--line--wrapper";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "c-to-do-list--line--input";
    input.value = defaultValue;
    input.addEventListener("input", ev => this.eventInput(ev, nr));
    this.eventInput(input, nr);
    lineWrapper.appendChild(input);

    const addNew = document.createElement("button");
    addNew.className = "c-to-do-list--line--add-new-button";
    addNew.innerText = "+";
    addNew.addEventListener("click", () => this.addList());
    lineWrapper.appendChild(addNew);

    const removeLine = document.createElement("button");
    removeLine.className = "c-to-do-list--line--remove-button";
    removeLine.innerText = "-";
    removeLine.addEventListener("click", ev => this.removeLine(ev, nr));
    lineWrapper.appendChild(removeLine);

    this.linesWrapper.appendChild(lineWrapper);
  }
}

function helloPage(target = document.querySelector("body")) {
  target.innerHTML = "";

  const newList = document.createElement("button");
  newList.onclick = () => new List({ target });
  newList.innerText = 'New "to do" list';
  target.appendChild(newList);

  if (localStorage.getItem("list") !== null) {
    const prevs = document.createElement("select");
    prevs.onchange = ev => {
      const active = Array.from(ev.target.options).filter(e => e.selected)[0];
      console.log(active.dataset.list.split(","));
      new List({
        target,
        defaultValue: active.dataset.list.split(",")
      });
    };
    const titleprev = document.createElement("option");
    titleprev.innerText = 'Choose your "to do" list';
    prevs.appendChild(titleprev);

    JSON.parse(localStorage.getItem("list")).forEach((el, nr) => {
      const option = document.createElement("option");
      option.innerText = el.createdDate;
      option.value = nr;
      option.dataset.list = el.values;
      prevs.appendChild(option);
    });

    target.appendChild(prevs);
  }
}

(() => {
  console.log("js file loaded");

  helloPage(document.querySelector("#root"));

  // document.querySelector('#n').onclick = () => {
  //   new List({ target: document.querySelector('#root') });
  // }

  // if (localStorage.getItem('list') !== null) {
  //   document.querySelector('#l').onclick = () => {
  //     new List({
  //       target: document.querySelector('#root'),
  //       defaultValue: localStorage.getItem('list').split(',')
  //     });
  //   }
  // }
  // else document.querySelector('#l').remove();

  // const z = new List({ target: document.querySelector('#root') });
})();
