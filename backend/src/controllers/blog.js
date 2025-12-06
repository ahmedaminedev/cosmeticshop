
const BlogPost = require('../models/BlogPost');
const catchAsync = require('../utils/catchAsync');

exports.getBlogPosts = catchAsync(async (req, res) => {
  // Récupère les messages stockés dans MongoDB, triés par date décroissante
  const posts = await BlogPost.find({}).sort({ createdAt: -1 });
  res.json(posts);
});

exports.getBlogPostBySlug = catchAsync(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug });
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Article non trouvé' });
  }
});

exports.createBlogPost = catchAsync(async (req, res) => {
  const { title, content, excerpt, category, imageUrl } = req.body;

  // Génération simple du slug à partir du titre
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now();

  // On utilise le nom de l'utilisateur connecté comme auteur
  // Pas de distinction de rôle ici (Admin ou Client = Auteur)
  const authorName = `${req.user.firstName} ${req.user.lastName}`;
  
  // Image par défaut si l'user n'en a pas (Avatar généré)
  const authorImage = req.user.photo_profil || `https://ui-avatars.com/api/?name=${req.user.firstName}+${req.user.lastName}&background=random&color=fff`;

  const newPost = await BlogPost.create({
    id: Date.now(),
    slug,
    title,
    content,
    excerpt,
    category,
    imageUrl,
    author: authorName,
    authorImageUrl: authorImage,
    date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }),
    userId: req.user._id, 
    featured: false 
  });

  res.status(201).json(newPost);
});
