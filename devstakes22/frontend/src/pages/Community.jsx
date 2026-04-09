import React from 'react';
import { MessageSquare, Users, Star, Award } from 'lucide-react';

const Community = () => {
    return (
        <div className="page-hero">
            <div className="community-container">
                <h1 className="page-title">Cine <span className="gradient-text">Community</span></h1>
                <p className="modal-subtitle" style={{textAlign: 'left', marginBottom: '3rem'}}>
                    Connect with millions of movie enthusiasts worldwide
                </p>

                <div className="community-grid">
                    <div className="community-card glass-card">
                        <div className="community-stat">
                            <span className="big-num gradient-text">4.0M</span>
                            <span className="community-label">Active Users</span>
                        </div>
                        <p className="detail-meta-item"><Users size={16} /> Global Network</p>
                    </div>
                    <div className="community-card glass-card">
                        <div className="community-stat">
                            <span className="big-num gradient-text">15M</span>
                            <span className="community-label">Reviews</span>
                        </div>
                        <p className="detail-meta-item"><MessageSquare size={16} /> Real Feedback</p>
                    </div>
                    <div className="community-card glass-card">
                        <div className="community-stat">
                            <span className="big-num gradient-text">850K</span>
                            <span className="community-label">Discussions</span>
                        </div>
                        <p className="detail-meta-item"><Award size={16} /> Active Debates</p>
                    </div>
                </div>

                <div className="reviews-section">
                    <h3 className="detail-section-title">Recent Critic Reviews</h3>
                    <div className="reviews-list">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="review-card glass-card">
                                <div className="reviewer">
                                    <div className="avatar">JD</div>
                                    <span>MovieFan_{i}</span>
                                    <div className="review-stars text-yellow">
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                    </div>
                                </div>
                                <h4>Absolute Masterpiece!</h4>
                                <p>"The visual effects and storytelling in this were beyond anything I've seen this year. A must-watch for every cinephile."</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
