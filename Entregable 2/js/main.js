let matches = JSON.parse(localStorage.getItem("matches")) || [];

document.getElementById("matchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("matchName").value;
  const capacity = parseInt(document.getElementById("matchCapacity").value);
  const cost = parseInt(document.getElementById("matchCost").value);

  const newMatch = {
    id: Date.now(),
    name,
    capacity,
    cost,
    players: []
  };

  matches.push(newMatch);
  saveAndRender();
  e.target.reset();
});

function saveAndRender() {
  localStorage.setItem("matches", JSON.stringify(matches));
  renderMatches();
}

function renderMatches() {
    const container = document.getElementById("matchesContainer");
    container.innerHTML = "";
  
    matches.forEach(match => {
      const div = document.createElement("div");
      div.className = "card";
  
      const paidCount = match.players.filter(p => p.paid).length;
      const totalPaid = ((match.cost / match.capacity) * paidCount).toFixed(2);
  
      div.innerHTML = `
        <h3>${match.name}</h3>
        <p>Capacidad: ${match.capacity}</p>
        <p>Valor Cancha: $${match.cost}</p>
        <p>Pagado: $${totalPaid} / $${match.cost}</p>
  
        <form data-id="${match.id}" class="addPlayerForm">
          <input type="text" name="playerName" placeholder="Nombre jugador" required>
          <label>
            <input type="checkbox" name="paid"> ¿Pagó?
          </label>
          <button type="submit">Agregar jugador</button>
        </form>
  
        <ul id="playerList-${match.id}"></ul>
      `;
      container.appendChild(div);
  
      // Listar jugadores
      const ul = div.querySelector(`#playerList-${match.id}`);
      match.players.forEach((player, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="${player.paid ? 'paid' : 'unpaid'}">${player.name}</span>
          <input type="checkbox" ${player.paid ? "checked" : ""} data-match-id="${match.id}" data-index="${index}" class="togglePaid">
          <label>Pagó</label>
        `;
        ul.appendChild(li);
      });
    });
  
    // Agregar jugador
    document.querySelectorAll(".addPlayerForm").forEach(form => {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = parseInt(this.dataset.id);
        const name = this.playerName.value;
        const paid = this.paid.checked;
  
        const match = matches.find(m => m.id === id);
        if (match.players.length < match.capacity) {
          match.players.push({ name, paid });
          saveAndRender();
        } else {
          alert("¡Capacidad completa!");
        }
      });
    });
  
    // Checkbox valida pago
    document.querySelectorAll(".togglePaid").forEach(checkbox => {
      checkbox.addEventListener("change", function () {
        const matchId = parseInt(this.dataset.matchId);
        const index = parseInt(this.dataset.index);
        const match = matches.find(m => m.id === matchId);
  
        if (match && match.players[index]) {
          match.players[index].paid = this.checked;
          saveAndRender();
        }
      });
    });
  }
  

renderMatches();
