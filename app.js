const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
// Express uygulamasını başlat
const app = express();

// Rotaları içe aktar
const postsRoutes = require("./routes/posts");

// Middleware
app.use(express.static(path.join(__dirname, "public"))); // Static dosyalar
app.use(express.urlencoded({ extended: true })); // Form verilerini işlemek için
app.use(methodOverride("_method"));

// EJS Ayarları
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Rotaları Kullan
app.use("/", postsRoutes);

// Sunucuyu Başlat
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
