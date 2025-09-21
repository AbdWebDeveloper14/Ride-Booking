// static/js/app.js

document.addEventListener("DOMContentLoaded", () => {
  const driversData = [
    { id: 1, name: "Ali", car: "Toyota Corolla", rating: 4.8, eta: "5 min", priceHint: 300 },
    { id: 2, name: "Sara", car: "Suzuki Alto", rating: 4.5, eta: "3 min", priceHint: 250 },
    { id: 3, name: "John", car: "Honda City", rating: 4.7, eta: "7 min", priceHint: 320 }
  ];

  const driversList = document.getElementById("driversList");
  const offersTable = document.getElementById("offersTable");
  const statusMsg = document.getElementById("statusMsg");

  function renderDrivers() {
    driversList.innerHTML = "";
    driversData.forEach(d => {
      const card = document.createElement("div");
      card.className = "bg-white/5 rounded-lg p-4 flex flex-col gap-2";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <div class="font-semibold text-lg">${d.name}</div>
            <div class="text-sm text-white/80">${d.car}</div>
          </div>
          <div class="text-right">
            <div class="text-sm">⭐ ${d.rating}</div>
            <div class="text-sm text-white/80">${d.eta}</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-sm text-white/80">Expected: <span class="font-semibold">PKR ${d.priceHint}</span></div>
          <button data-id="${d.id}" class="ml-auto px-3 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white accept-btn">Send Offer</button>
        </div>
      `;
      driversList.appendChild(card);
    });
  }

  function addOfferRow(offer) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="py-2">${new Date().toLocaleTimeString()}</td>
      <td class="py-2">${offer.pickup} → ${offer.dropoff}</td>
      <td class="py-2">PKR ${offer.price}</td>
      <td class="py-2 text-sm">${offer.status}</td>
    `;
    offersTable.prepend(tr);
  }

  renderDrivers();

  // Offer form handling
  const offerForm = document.getElementById("offerForm");
  offerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      pickup: document.getElementById("pickup").value.trim(),
      dropoff: document.getElementById("dropoff").value.trim(),
      carType: document.getElementById("carType").value,
      price: Number(document.getElementById("offerPrice").value)
    };
    if (!data.pickup || !data.dropoff || !data.price) {
      statusMsg.textContent = "Complete the form.";
      return;
    }

    // Demo: add to offers table and show simulated driver responses
    addOfferRow({...data, status: "Searching..."});
    statusMsg.textContent = "Offer published — waiting for drivers...";
    offerForm.reset();

    // Simulate driver responses (random)
    setTimeout(() => {
      const acceptedDriver = driversData[Math.floor(Math.random() * driversData.length)];
      addOfferRow({...data, status: `Accepted by ${acceptedDriver.name}`});
      statusMsg.textContent = `Accepted by ${acceptedDriver.name} — ETA ${acceptedDriver.eta}`;
      // Optionally, show notification/modal (simple alert here)
      alert(`Good news — ${acceptedDriver.name} accepted your offer!`);
    }, 2000 + Math.random()*2000);
  });

  // Suggest price button
  document.getElementById("autoPrice").addEventListener("click", () => {
    // pick medium of drivers' priceHint + random
    const avg = Math.round(driversData.reduce((s,d)=>s+d.priceHint,0)/driversData.length);
    const suggestion = avg + (Math.random() > 0.5 ? -20 : 20);
    document.getElementById("offerPrice").value = suggestion;
    statusMsg.textContent = `Suggested: PKR ${suggestion}`;
  });

  // Delegate "Send Offer" on driver cards to prefill offer and trigger quick publish
  driversList.addEventListener("click", (e) => {
    if (e.target.classList.contains("accept-btn")) {
      const id = Number(e.target.getAttribute("data-id"));
      const driver = driversData.find(d => d.id === id);
      // Prefill and auto-send
      document.getElementById("offerPrice").value = driver.priceHint;
      document.getElementById("pickup").value = document.getElementById("pickup").value || "Your location";
      document.getElementById("dropoff").value = document.getElementById("dropoff").value || "Destination";
      // Small visual click
      e.target.textContent = "Offer Sent";
      e.target.disabled = true;
      // Simulate sending via form submission:
      setTimeout(() => {
        addOfferRow({ pickup: document.getElementById("pickup").value, dropoff: document.getElementById("dropoff").value, price: driver.priceHint, status: `Sent to ${driver.name}` });
        statusMsg.textContent = `Offer sent to ${driver.name}`;
      }, 500);
    }
  });
});

fetch('data/ride.json')
    .then(response => response.json())
    .then(data => {
        rides = data;   // rides array update
        renderRides();  // render table
    });
