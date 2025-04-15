<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

let diseaseRecords = [];

// Read embedded CSV
const csvRaw = document.getElementById("csv-data").textContent.trim();
const parsed = Papa.parse(csvRaw, { header: true });
diseaseRecords = parsed.data;

const plantDropdown = document.getElementById("plantDropdown");
const symptom1Dropdown = document.getElementById("symptom1Dropdown");
const symptom2Dropdown = document.getElementById("symptom2Dropdown");

// Populate crop dropdown
const crops = [...new Set(diseaseRecords.map(r => r.Crop?.trim()).filter(Boolean))];
crops.forEach(crop => {
    const opt = document.createElement("option");
    opt.value = crop;
    opt.textContent = crop;
    plantDropdown.appendChild(opt);
});

// Update symptom dropdowns on crop change
plantDropdown.addEventListener("change", () => {
    const crop = plantDropdown.value;
    symptom1Dropdown.innerHTML = `<option value="">--Select Symptom 1--</option>`;
    symptom2Dropdown.innerHTML = `<option value="">--Select Symptom 2--</option>`;

    const filtered = diseaseRecords.filter(r => r.Crop?.trim() === crop);
    const symptom1Set = new Set(filtered.map(r => r.Symptom1?.trim()).filter(Boolean));
    const symptom2Set = new Set(filtered.map(r => r.Symptom2?.trim()).filter(Boolean));

    symptom1Set.forEach(sym => {
        const opt = document.createElement("option");
        opt.value = sym;
        opt.textContent = sym;
        symptom1Dropdown.appendChild(opt);
    });

    symptom2Set.forEach(sym => {
        const opt = document.createElement("option");
        opt.value = sym;
        opt.textContent = sym;
        symptom2Dropdown.appendChild(opt);
    });
});

// Identify matching disease
function identifyDisease() {
    const crop = plantDropdown.value;
    const sym1 = symptom1Dropdown.value;
    const sym2 = symptom2Dropdown.value;
    const resultDiv = document.getElementById("diseaseResult");

    const match = diseaseRecords.find(
        r => r.Crop?.trim() === crop &&
            r.Symptom1?.trim() === sym1 &&
            r.Symptom2?.trim() === sym2
    );

    resultDiv.textContent = match
        ? `Identified Disease: ${match.Disease}`
        : "No matching disease found.";
}
