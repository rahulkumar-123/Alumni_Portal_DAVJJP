import React, { useState } from 'react';
import feedbackService from '../services/feedbackService';
import toast from 'react-hot-toast';

export default function Feedback() {
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await feedbackService.submitFeedback(formData);
            toast.success("Feedback submitted successfully. Thank you!");
            setFormData({ subject: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit feedback.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Submit Feedback</h1>
                <p className="text-gray-600 mb-6">We would love to hear your thoughts, suggestions, or concerns.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required className="w-full p-2 border rounded-md" />
                    <textarea name="message" placeholder="Your message" value={formData.message} onChange={handleChange} required rows="5" className="w-full p-2 border rounded-md"></textarea>
                    <button type="submit" disabled={loading} className="w-full bg-brand-blue text-white py-2 rounded-md hover:bg-blue-800 disabled:bg-blue-300">
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}

