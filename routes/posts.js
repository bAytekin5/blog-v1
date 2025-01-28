const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// JSON dosyasının yolu
const postsFile = path.join(__dirname, "../data/posts.json");

// Postları dosyadan yükle
let posts = [
    { id: 1, title: "Teknoloji Trendleri 2024", content: "Teknoloji hızla gelişiyor!", category: "Teknoloji" },
    { id: 2, title: "En İyi Seyahat Destinasyonları", content: "Dünyayı keşfedin!", category: "Seyahat" },
];
if (fs.existsSync(postsFile)) {
    const data = fs.readFileSync(postsFile, "utf-8");
    posts = JSON.parse(data);
}

// Ana Sayfa Rotası
router.get("/", (req, res) => {
    res.render("home", { posts });
});

// Yeni Post Oluşturma Rotası
router.post("/", (req, res) => {
    const { title, content, category } = req.body;
    const id = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1;
    const newPost = { id, title, content, category};
    posts.push(newPost);

    // Postları dosyaya kaydet
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
    res.redirect("/");
});

// Düzenleme Sayfası Gösterme Rotası
router.get("/posts/:id/edit", (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === parseInt(id));
    if (!post) return res.status(404).send("Post not found!");
    res.render("editPost", { post });
});

router.get("/filter", (req, res) => {
    const {category} = req.query;
    if(category){
        const filteredPosts = posts.filter(post => post.category === category);
        return res.render("home", {posts: filteredPosts});
    }
    res.redirect("/");
});

// Post Güncelleme Rotası
router.post("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const post = posts.find(p => p.id === parseInt(id));
    if (!post) return res.status(404).send("Post not found!");
    post.title = title;
    post.content = content;

    // Postları dosyaya kaydet
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
    res.redirect("/");
});

// Post Silme Rotası
router.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    const postIndex = posts.findIndex(p => p.id === parseInt(id));
    if (postIndex !== -1) {
        posts.splice(postIndex, 1);

        // Güncellenmiş postları dosyaya kaydet
        fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
    }
    res.redirect("/");
});

module.exports = router;
