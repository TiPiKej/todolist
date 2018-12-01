function dropEvent(target) {
  document.querySelector("body").addEventListener("dragover", ev => {
    ev.preventDefault();

    document.querySelector("#dragShow").className = "active";
  });

  document.querySelector("body").addEventListener("dragleave", ev => {
    ev.preventDefault();

    document.querySelector("#dragShow").className = "";
  });

  document.querySelector("body").addEventListener("drop", ev => {
    ev.preventDefault();

    const { files } = ev.dataTransfer;
    let loadedTest;

    var reader = new FileReader();
    reader.onload = function(evt) {
      loadedTest = evt.target.result;
      loadedTest = JSON.parse(loadedTest);

      new List({ target, nr: loadedTest.id, defaultValue: loadedTest.values });
    };

    Array.from(files).forEach(file => {
      if (file.type === "application/json") reader.readAsText(file);
    });
    document.querySelector("#dragShow").className = "";
  });

  // Eventshower

  if (document.querySelector("#dragShow") === null) {
    const e = document.createElement("div");
    e.id = "dragShow";
    // e.className = "active";
    document.querySelector("body").appendChild(e);

    const text = document.createElement("p");
    text.innerText = "Drop file";
    e.appendChild(text);
  }
}
