// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware biar bisa baca JSON dan form data
app.use(cors());
app.use(bodyParser.json());

// DATABASE SEMENTARA (ARRAY)
let feedbacks = [];

// ROUTES API

// 1. GET: Ambil semua feedback (Untuk Admin Panel)
app.get("/api/feedback", (req, res) => {
  res.json({
    message: "Data retrieved successfully",
    data: feedbacks,
  });
});

// 2. POST: Submit feedback baru (Untuk Form Public)
app.post("/api/feedback", (req, res) => {
  const { name, email, eventName, division, rating, comment, suggestion } =
    req.body;

  // Validasi simple
  if (!name || !email || !eventName || !rating) {
    return res.status(400).json({ message: "Field wajib harus diisi!" });
  }

  const newFeedback = {
    id: Date.now().toString(), // Bikin ID unik pake waktu
    name,
    email,
    eventName,
    division, // Enum: "LnT" | "EEO" | "PR" | "HRD" | "RnD"
    rating: parseInt(rating),
    comment: comment || "",
    suggestion: suggestion || "",
    createdAt: new Date().toISOString(), //
    status: "open", // Default status
  };

  feedbacks.push(newFeedback); // Simpan ke array
  console.log("Feedback baru masuk:", newFeedback);

  res.status(201).json({
    message: "Feedback berhasil dikirim!",
    data: newFeedback,
  });
});

//ROUTE UNTUK UPDATE DATA
app.put("/api/feedback/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  // Cari index data yang mau diedit
  const index = feedbacks.findIndex((item) => item.id === id);

  if (index !== -1) {
    // Update data yang ada dengan data baru
    feedbacks[index] = { ...feedbacks[index], ...updatedData };

    res.json({
      message: "Feedback berhasil diupdate!",
      data: feedbacks[index],
    });
  } else {
    res.status(404).json({ message: "Feedback tidak ditemukan" });
  }
});

// 3. DELETE: Hapus feedback berdasarkan ID
app.delete("/api/feedback/:id", (req, res) => {
  const { id } = req.params;
  feedbacks = feedbacks.filter((item) => item.id !== id); // Filter data selain ID yg dihapus
  res.json({ message: `Feedback dengan ID ${id} berhasil dihapus` });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
