import {Post} from '../models/posts.js';
//Create a post

const createPost = async(req,res)=>{
    try{
        const {title,info,tag,tagColor,senderName,postType} = req.body;

         if (!title || !info || !tag || !tagColor || !senderName) {
             return res.status(400).json({ message: 'All fields are required' });
         }
        
         const post = await Post.create({
            title,info,tag,tagColor,senderName,postType,replies:[]
         });

         res.status(201).json({message:'Posted Successfully',post})

    }
    catch(e){
        console.log(e);
        res.status(500).json({error:e.message});

    }
}
//get All posts

const getAllPosts = async (req,res) => {
    try{
        const posts = await Post.find().sort({createdAt:-1});
        res.status(200).json(posts)

    }
    catch(e){
        console.log(e);
        res.status(500).json({error:e.message});

    }
    
}

//Add reply to a post

const addReply = async (req,res) => {
    const {postId} = req.params;
    const {senderName,message} = req.body;

    if(!senderName || !message){
        return res.status(400).json({message: 'eigther of message or senderName is not present'})
    }
    try{
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"No post of this id found"});
        }
        const reply = {senderName,message,createdAt:new Date()};
        post.replies.push(reply);
        await post.save();
        res.status(200).json({ message: 'Reply added', post });

    }
    catch(e){
         console.log(e);
        res.status(500).json({error:e.message});

    }
    
}

//Get replies By Id
const getRepliesByPostId = async (req,res) => {
    try {
        const {postId} = req.params;
        const post = await Post.findById(postId);
        
        if(!post){
            return res.status(404).json({message:"No such Id found"})
        }
        res.status(200).json({replies:post.replies});
        
    } catch (err) {
          console.log(err);
        res.status(500).json({error:err.message});

        
    }
}

//get Post By Type

const getPostByType = async (req,res) => {
    try{
        const {type} = req.query;
        const query = type?{postType:type}:{}; 
        const posts = await Post.find(query).sort({createdAt:-1});
        res.status(200).json(posts);

    }
    catch(err){
         res.status(500).json({ message: 'Server error', error: err.message });

    }
    
}
//Get Post By Id

const getPostById = async (req,res) => {
    try{
        const {postId} = req.params;
        const post = await Post.findById(postId);
        if(!post){
           return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);


    }
    catch(err){
         res.status(500).json({ message: 'Server error', error: err.message });
    }
    
}

export {
    createPost,
    getAllPosts,
    addReply,
    getRepliesByPostId,
    getPostById,
    getPostByType
}