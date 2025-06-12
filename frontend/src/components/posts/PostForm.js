import React, { useState } from 'react';
import postService from '../../services/postService';
import toast from 'react-hot-toast';
export default function PostForm({ onPostCreated }) {
    const [formData, setFormData] = useState({ title: '', content: '', category: 'News Update' });
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try { await postService.createPost(formData); toast.success('Post submitted for approval!'); setFormData({ title: '', content: '', category: 'News Update' }); onPostCreated(); } catch (error) { toast.error("Failed to create post."); } finally { setLoading(false); }
    };
    return (<form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title for your post..." value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
        <textarea name="content" placeholder="What's on your mind?" rows="4" value={formData.content} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
        <div className="flex justify-between items-center"><select name="category" value={formData.category} onChange={handleChange} className="border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
            <option>News Update</option><option>Job Opening</option><option>Article</option><option>Event</option>
        </select><button type="submit" disabled={loading} className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark disabled:bg-primary-light transition-colors">
                {loading ? 'Submitting...' : 'Submit Post'}
            </button></div>
    </form>);
}
