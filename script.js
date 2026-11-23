const API_BASE = "backend";

const form = document.getElementById("form-mahasiswa");
const inputId = document.getElementById("mahasiswa-id");
const inputNama = document.getElementById("nama");
const inputNim = document.getElementById("nim");
const btnSimpan = document.getElementById("btn-simpan");
const btnBatal = document.getElementById("btn-batal");
const tabelBody = document.getElementById("tabel-mahasiswa");

// Ambil semua data (READ)
async function ambilData() {
  try {
    const res = await fetch(`${API_BASE}/read.php`);
    const json = await res.json();

    tabelBody.innerHTML = "";

    if (!json.success || json.data.length === 0) {
      tabelBody.innerHTML = `<tr><td colspan="5" class="center">Belum ada data mahasiswa.</td></tr>`;
      return;
    }

    json.data.forEach((item, idx) => {
      const namaAman = item.nama.replace(/'/g, "\\'");
      const nimAman = item.nim.replace(/'/g, "\\'");

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${idx + 1}</td>
                <td>${item.nama}</td>
                <td>${item.nim}</td>
                <td>${item.created_at}</td>
                <td>
                    <button class="btn-edit" onclick="modeEdit(${item.id}, '${namaAman}', '${nimAman}')">Edit</button>
                    <button class="btn-hapus" onclick="hapusData(${item.id})">Hapus</button>
                </td>
            `;
      tabelBody.appendChild(row);
    });
  } catch (err) {
    tabelBody.innerHTML = `<tr><td colspan="5" class="center" style="color:red;">Gagal memuat data dari backend.</td></tr>`;
  }
}

// Tambah & Ubah data (CREATE & UPDATE)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = inputId.value;
  const nama = inputNama.value.trim();
  const nim = inputNim.value.trim();

  const url = id ? `${API_BASE}/update.php` : `${API_BASE}/create.php`;
  const bodyData = id ? { id: parseInt(id), nama, nim } : { nama, nim };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });
    const json = await res.json();

    if (json.success) {
      resetForm();
      ambilData();
    } else {
      alert(json.message);
    }
  } catch (err) {
    alert("Terjadi kesalahan koneksi ke server.");
  }
});

// Masuk ke mode edit
function modeEdit(id, nama, nim) {
  inputId.value = id;
  inputNama.value = nama;
  inputNim.value = nim;
  btnSimpan.textContent = "Update";
  btnBatal.classList.remove("hidden");
}

btnBatal.addEventListener("click", resetForm);

function resetForm() {
  inputId.value = "";
  form.reset();
  btnSimpan.textContent = "Simpan";
  btnBatal.classList.add("hidden");
}

// Hapus data (DELETE)
async function hapusData(id) {
  if (!confirm("Hapus data mahasiswa ini?")) return;

  try {
    const res = await fetch(`${API_BASE}/delete.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();

    if (json.success) {
      ambilData();
    } else {
      alert(json.message);
    }
  } catch (err) {
    alert("Gagal menghapus data.");
  }
}

// Panggil saat halaman pertama kali dibuka
ambilData();
