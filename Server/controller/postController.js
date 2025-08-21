const { Post } = require('../models/posts');
//Create a post

exports.createPost = async (req, res) => {
    try {
        const { title, info, tag, tagColor, senderName, postType } = req.body;

        if (!title || !info || !tag || !tagColor || !senderName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const post = await Post.create({
            title, info, tag, tagColor, senderName, postType, replies: []
        });

        res.status(201).json({ message: 'Posted Successfully', post })

    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });

    }
}
//get All posts

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts)

    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });

    }

}

//Add reply to a post

exports.addReply = async (req, res) => {
    const { postId } = req.params;
    const { senderName, message } = req.body;

    if (!senderName || !message) {
        return res.status(400).json({ message: 'eigther of message or senderName is not present' })
    }
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "No post of this id found" });
        }
        const reply = { senderName, message, createdAt: new Date() };
        post.replies.push(reply);
        await post.save();
        res.status(200).json({ message: 'Reply added', post });

    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });

    }

}

//Get replies By Id
exports.getRepliesByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "No such Id found" })
        }
        res.status(200).json({ replies: post.replies });

    } catch (err) {
        console.log(e);
        res.status(500).json({ error: e.message });


    }
}

//get Post By Type

exports.getPostByType = async (req, res) => {
    try {
        const { type } = req.query;

        // Input validation and sanitization for query parameters
        if (type && typeof type !== 'string') {
            return res.status(400).json({
                message: 'Invalid type parameter'
            });
        }

        // Length validation to prevent injection attacks
        if (type && type.length > 50) {
            return res.status(400).json({
                message: 'Type parameter too long'
            });
        }

        // Validate against allowed post types to prevent injection
        const allowedTypes = ['experience', 'question', 'review', 'tip', 'story'];
        if (type && !allowedTypes.includes(type)) {
            return res.status(400).json({
                message: 'Invalid post type specified'
            });
        }

        const query = type ? { postType: type } : {};
        const posts = await Post.find(query).sort({ createdAt: -1 });
        res.status(200).json(posts);

    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });

    }

}
//Get Post By Id

exports.getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);


    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }

}