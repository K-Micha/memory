const UI = {
  player: [
    document.getElementById("player-blue")  as HTMLInputElement,
    document.getElementById("player-orange") as HTMLInputElement
  ],
  board: [
    document.getElementById("board-16") as HTMLInputElement,
    document.getElementById("board-24") as HTMLInputElement,
    document.getElementById("board-36") as HTMLInputElement
  ]
} as const;

Object.values(UI).forEach(group => {
  group.forEach(r => {
    r.checked = false;
    r.onclick = () => {
      if (r.checked && r.dataset.x === "1") {
        r.checked = false;
        r.dataset.x = "0";
      } else if (r.checked) {
        group.forEach(o => o.dataset.x = "0");
        r.dataset.x = "1";
      }
    };
  });
});
