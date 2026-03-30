document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".fade-in-section");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  items.forEach(item => observer.observe(item));
});


function getGreekHolidays(year) {
  return [
    `${year}-01-01`,
    `${year}-01-06`,
    `${year}-03-25`,
    `${year}-05-01`,
    `${year}-08-15`,
    `${year}-10-28`,
    `${year}-12-25`,
    `${year}-12-26`
  ];
}  
function setupDateRestrictions() {
  const dateInput = document.getElementById("deliveryDate");

  const today = new Date();
  today.setDate(today.getDate() + 1); // Δεν επιτρέπεται σήμερα → earliest αύριο

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  dateInput.min = `${yyyy}-${mm}-${dd}`;

  // Μπλοκάρει Σάββατο / Κυριακή
dateInput.addEventListener("change", () => {
  const selectedDate = dateInput.value;
  const chosen = new Date(selectedDate);
  const day = chosen.getDay();

  const holidays = getGreekHolidays(chosen.getFullYear());

  // Σαββατοκύριακο
  if (day === 0 || day === 6) {
    alert("❗ Δεν επιτρέπεται ραντεβού Σάββατο & Κυριακή.");
    dateInput.value = "";
    return;
  }

  // Αργίες
  if (holidays.includes(selectedDate)) {
    alert("❗ Δεν επιτρέπεται ραντεβού σε επίσημη αργία.");
    dateInput.value = "";
    return;
  }
});
}
setupDateRestrictions();


document.getElementById("csContact").addEventListener("change", function () {
  const box = document.getElementById("csFields");

  if (this.checked) {
    box.classList.remove("cs-hidden");
    box.classList.add("cs-visible");
  } else {
    box.classList.add("cs-hidden");
    box.classList.remove("cs-visible");
  }
});

function validateDelivery() {

// -- hs code --  
if (!checkHsCodes()) return;

  // --- Έλεγχοι ---
  console.log("changeAddress:", document.getElementById("changeAddress").checked)
  const csWanted = document.getElementById("csContact").checked;
const home = document.getElementById("deliveryHome");
const ramp = document.getElementById("deliveryRamp");

const typeSelected = home.checked || ramp.checked || 
document.getElementById("changeAddress").checked;

  const date = document.getElementById("deliveryDate").value;

  if (!typeSelected) {
    alert("❗ Παρακαλώ επιλέξτε διαχείριση φορτίου.");
    return;
  }

  if (!date) {
    alert("❗ Παρακαλώ επιλέξτε ημερομηνία.");
    return;
  }

  // --- Βασικά στοιχεία ---
  let typeSelectedText = "";

if (home.checked) {
    typeSelectedText = "Παράδοση στη διεύθυνση παραλήπτη";
}
else if (ramp.checked) {
    typeSelectedText = "Παραλαβή από ράμπα";
}
else if (document.getElementById("changeAddress").checked) {
    typeSelectedText = "Αλλαγή διεύθυνσης";
}
  const rawDate = document.getElementById("deliveryDate").value;
  const [yyyy, mm, dd] = rawDate.split("-");
  const dateValue = `${dd}/${mm}/${yyyy}`;
// --- Required fields if new address is selected ---
const newAddressChecked = document.getElementById("changeAddress").checked;
if (newAddressChecked) {
    const requiredFields = [
        { id: "street", label: "Οδός" },
        { id: "street_number", label: "Αριθμός" },
        { id: "district", label: "Περιοχή" },
        { id: "city", label: "Πόλη" },
        { id: "postal_code", label: "Τ.Κ." }
    ];

    let missingFields = [];

for (const field of requiredFields) {
    const input = document.getElementById(field.id);

    if (input.value.trim() === "") {
        missingFields.push(field.label);

        // 🔴 highlight field
        input.style.border = "2px solid red";
    } else {
        input.style.border = "";
    }
}

if (missingFields.length > 0) {
    alert("❗ Συμπληρώστε τα υποχρεωτικά πεδία:\n\n" + missingFields.join("\n"));
    return;
}
}
  // --- Στοιχεία Νέας Διεύθυνσης ---
  let addressHTML = "";

  if (newAddressChecked) {
    const street = document.getElementById("street").value || "-";
    const number = document.getElementById("street_number").value || "-";
    const district = document.getElementById("district").value || "-";
    const city = document.getElementById("city").value || "-";
    const postal = document.getElementById("postal_code").value || "-";

    addressHTML = `
      <p><strong>Νέα Διεύθυνση:</strong></p>
      <p>Οδός: ${street} ${number}</p>
      <p>Περιοχή: ${district}</p>
      <p>Πόλη: ${city}</p>
      <p>Τ.Κ.: ${postal}</p>
    `;
  }

if (csWanted) {
    const csFields = [
        { id: "csName", label: "Όνομα Επικοινωνίας" },
        { id: "csPhone", label: "Τηλέφωνο Επικοινωνίας" }
    ];

    let missingFields = [];

    for (const field of csFields) {
        const input = document.getElementById(field.id);

        if (input.value.trim() === "") {
            missingFields.push(field.label);
            input.style.border = "2px solid red";
        } else {
            input.style.border = "";
        }
    }

    // Έλεγχος τηλεφώνου (10 ψηφία)
    const phoneInput = document.getElementById("csPhone");
    const phoneValue = phoneInput.value.trim();

    if (phoneValue !== "" && !/^\d{10}$/.test(phoneValue)) {
        alert("❗ Το τηλέφωνο πρέπει να περιέχει ακριβώς 10 ψηφία.");
        phoneInput.style.border = "2px solid red";
        return;
    }

    if (missingFields.length > 0) {
        alert("❗ Συμπληρώστε τα στοιχεία επικοινωνίας:\n\n" + missingFields.join("\n"));
        return;
    }
}

// --- ΝΕΑ ΠΕΔΙΑ VALIDATION ---
const hsCodes = [...document.querySelectorAll('input[name="hsCode[]"]')]
  .map(input => input.value.trim())
  .filter(val => val !== "");
const installationCode = document.getElementById("installationCode").value.trim();
const comments = document.getElementById("comments").value.trim();

// Installation Code: ΥΠΟΧΡΕΩΤΙΚΟ + 3 ψηφία

if (newAddressChecked) {
    if (!/^\d{3}$/.test(installationCode)) {
        alert("❗ Ο Κωδικός Εγκατάστασης πρέπει να έχει ακριβώς 3 ψηφία.");
        document.getElementById("installationCode").style.border = "2px solid red";
        return;
    } else {
        document.getElementById("installationCode").style.border = "";
    }
}

// Comments limit (extra safety)
if (comments.length > 200) {
  alert("❗ Οι παρατηρήσεις πρέπει να είναι έως 200 χαρακτήρες.");
  return;
}

  // --- Confirmation Page (New Tab) ---
  const confirmationPage = `
  <html lang="el">
    <head>
      <meta charset="UTF-8" />
      <title>Επιβεβαίωση Καταχώρησης</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background: #f1f3f5;
          padding: 3rem;
          color: #2d4a2f;
        }
        .box {
          background: #d4f5d2;
          border-left: 6px solid #c9a227;
          padding: 2rem;
          border-radius: 12px;
          max-width: 600px;
          margin: auto;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        h2 {
          margin-top: 0;
          color: #001f3f;
          font-size: 1.8rem;
        }
        p {
          font-size: 1.15rem;
          line-height: 1.6;
          margin-bottom: 0.7rem;
        }
      </style>
    </head>

    <body>
      <div class="box">
        <h2>Επιτυχής Καταχώρηση!</h2>

        <p><strong>Τρόπος Διαχείρισης:</strong> ${typeSelectedText}</p>
        <p><strong>Ημερομηνία:</strong> ${dateValue}</p>
        ${addressHTML}

        ${csWanted ? `<br><p>Η ομάδα της MEDLOG S.A. Mediterranean Logistics θα επικοινωνήσει εντός 24 ωρών για τελική επιβεβαίωση.</p>` : ""}
      </div>
    </body>
  </html>
  `;

document.body.innerHTML = confirmationPage;
}


function updateDateTime() {
  const now = new Date();

  const weekdays = ['Κυριακή','Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο'];

  const dayName = weekdays[now.getDay()];
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const formatted = `${dayName} ${day}/${month}, ${hours}:${minutes}`;

  document.getElementById('datetime').textContent = formatted;
}

setInterval(updateDateTime, 60000);
updateDateTime();

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("deliveryDate").addEventListener("click", function(){
  this.showPicker && this.showPicker();  // για Chrome / Edge / Android / iOS
});

["street","street_number","district","city","postal_code"].forEach(id => {
  document.getElementById(id).addEventListener("input", function() {
    this.style.border = "";
  });
});

["csName","csPhone"].forEach(id => {
  document.getElementById(id).addEventListener("input", function() {
    this.style.border = "";
  });
});

document.getElementById("gdprLink").addEventListener("click", function () {
  document.getElementById("gdprPopup").style.display = "flex";
});

document.getElementById("closePopup").addEventListener("click", function () {
  document.getElementById("gdprPopup").style.display = "none";
});

// Optional: Κλείσιμο με κλικ εκτός κουτιού
document.getElementById("gdprPopup").addEventListener("click", function(e){
  if (e.target === this) this.style.display = "none";
});

document.getElementById("deliveryDate").addEventListener("change", function () {
  const val = this.value; // πχ "2026-03-24"
  if (!val) return;

  const [yyyy, mm, dd] = val.split("-");
  const formatted = `${dd}/${mm}/${yyyy}`; // dd/mm/yyyy

  document.getElementById("formattedDate").textContent =
    "Επιλεγμένη: " + formatted;
});

function addHsRow() {
  const container = document.getElementById("hsContainer");

  const row = document.createElement("div");
  row.className = "hs-row";

row.innerHTML = `
  <input type="text" name="hsCode[]" placeholder="π.χ. 3004900000" onkeydown="handleHsEnter(event)">
  <button type="button" class="remove-btn" onclick="this.parentElement.remove()">−</button>
`;

  container.appendChild(row);
}

function handleHsEnter(e) {
  if (e.key === "Enter") {
    e.preventDefault(); // να μην κάνει submit

    addHsRow();

    // focus στο τελευταίο input που μόλις δημιουργήθηκε
    const inputs = document.querySelectorAll('input[name="hsCode[]"]');
    inputs[inputs.length - 1].focus();
  }
}

const home   = document.getElementById("deliveryHome");
const ramp   = document.getElementById("deliveryRamp");
const change = document.getElementById("changeAddress");

const addressBox    = document.getElementById("receiverAddressBox");
const addressFields = document.getElementById("addressFields");
const rampMap       = document.getElementById("rampMap");

function activateOnly(clickedBox) {

  // Αν το checkbox είναι ήδη checked → άστο να ξε-τσεκαριστεί
  if (!clickedBox.checked) {
    updateUI();
    return;
  }

  // αλλιώς συμπεριφέρσου σαν radio
  home.checked = false;
  ramp.checked = false;
  change.checked = false;

  clickedBox.checked = true;

  updateUI();
}

function updateUI() {

  const inputs = document.querySelectorAll("#addressFields input");

  // Παράδοση στη διεύθυνση
  if (home.checked) {
    addressBox.style.display = "block";
    rampMap.style.display = "none";

    addressFields.classList.add("address-hidden");

    // ❌ disable fields
    inputs.forEach(i => i.disabled = true);
  }

  // Παραλαβή από ράμπα
  else if (ramp.checked) {
    addressBox.style.display = "none";
    rampMap.style.display = "block";

    addressFields.classList.add("address-hidden");

    // ❌ disable fields
    inputs.forEach(i => i.disabled = true);
  }

  // Αλλαγή διεύθυνσης
  else if (change.checked) {
    addressBox.style.display = "block";
    rampMap.style.display = "none";

    addressFields.classList.remove("address-hidden");
    addressFields.classList.add("address-visible");

    // ✅ enable fields
    inputs.forEach(i => i.disabled = false);
  }

  // ❗ τίποτα επιλεγμένο
  else {
    addressFields.classList.add("address-hidden");

    // ❌ disable fields
    inputs.forEach(i => i.disabled = true);
  }
 // ❗ Αν το changeAddress δεν είναι checked → κλείσε τα fields
if (!change.checked) {
  addressFields.classList.add("address-hidden");
  addressFields.classList.remove("address-visible");

  const inputs = document.querySelectorAll("#addressFields input");
  inputs.forEach(i => {
    i.disabled = true;
  });
} 
}

/* ✅ EVENT LISTENERS */
home.addEventListener("change",  () => activateOnly(home));
ramp.addEventListener("change",  () => activateOnly(ramp));
change.addEventListener("change", () => activateOnly(change));

function checkHsCodes() {
    const hsInputs = document.querySelectorAll('input[name="hsCode[]"]');

    for (let input of hsInputs) {
        let value = input.value.trim();

        // Αν είναι κενό → επιτρέπεται
        if (value === "") continue;

        // Επιτρέπει μόνο αριθμούς
        if (!/^\d+$/.test(value)) {
            alert("❗ Οι Taric Codes πρέπει να περιέχουν μόνο αριθμούς.");
            input.focus();
            return false;
        }

        // Επιτρέπει ΜΟΝΟ 8 ή 10 ψηφία
        if (!(value.length === 8 || value.length === 10)) {
            alert("❗ Κάθε Taric Code πρέπει να έχει ακριβώς 8 ή 10 ψηφία.");
            input.focus();
            return false;
        }
    }

    return true;
}
