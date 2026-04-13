// components/Reviews.jsx
import React, { useState, useEffect, useContext } from 'react';
import { getProductReviews, addReview } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Reviews = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});

  // Screen size check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch reviews
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getProductReviews(productId);
      setReviews(response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('Please login to write a review');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      await addReview(productId, newReview);
      toast.success('Review added successfully!');
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle review expansion
  const toggleReview = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Render rating stars with animation
  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              color: star <= rating ? '#ffc107' : '#e0e0e0',
              fontSize: isMobile ? '18px' : '20px',
              transition: 'color 0.2s ease',
              cursor: 'default',
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Get initials from username
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  // Generate random pastel color based on username
  const getAvatarColor = (name) => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
      '#dfe6e9', '#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb'
    ];
    const index = name?.length % colors.length || 0;
    return colors[index];
  };

  const styles = {
    container: {
      marginTop: '30px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      flexWrap: 'wrap',
      gap: '15px',
    },
    title: {
      fontSize: isMobile ? '22px' : '24px',
      fontWeight: '600',
      color: '#2d3436',
      margin: 0,
      position: 'relative',
    },
    titleAccent: {
      width: '60px',
      height: '4px',
      background: 'linear-gradient(90deg, #ff6b6b, #ff8e8e)',
      borderRadius: '2px',
      marginTop: '8px',
    },
    stats: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      backgroundColor: '#f8f9fa',
      padding: '10px 20px',
      borderRadius: '12px',
    },
    averageRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    averageNumber: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#2d3436',
      lineHeight: 1,
    },
    totalReviews: {
      color: '#7f8c8d',
      fontSize: isMobile ? '14px' : '15px',
    },
    reviewsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '20px',
      marginBottom: '30px',
    },
    reviewCard: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: isMobile ? '20px' : '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      border: '1px solid #f0f0f0',
      height: 'fit-content',
      position: 'relative',
      overflow: 'hidden',
    },
    reviewCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    avatar: {
      width: isMobile ? '45px' : '50px',
      height: isMobile ? '45px' : '50px',
      borderRadius: '50%',
      backgroundColor: getAvatarColor,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: '600',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    },
    userDetails: {
      display: 'flex',
      flexDirection: 'column',
    },
    userName: {
      fontWeight: '600',
      color: '#2d3436',
      fontSize: isMobile ? '16px' : '17px',
      marginBottom: '4px',
    },
    reviewMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    date: {
      color: '#95a5a6',
      fontSize: isMobile ? '12px' : '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    verifiedBadge: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      fontSize: '11px',
      padding: '2px 8px',
      borderRadius: '12px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    },
    rating: {
      marginBottom: '12px',
    },
    comment: {
      color: '#4a5568',
      lineHeight: '1.7',
      fontSize: isMobile ? '14px' : '15px',
      marginBottom: '15px',
      position: 'relative',
    },
    commentExpanded: {
      maxHeight: 'none',
      overflow: 'visible',
    },
    commentCollapsed: {
      maxHeight: '80px',
      overflow: 'hidden',
      position: 'relative',
      maskImage: 'linear-gradient(180deg, #000 60%, transparent)',
    },
    readMoreBtn: {
      background: 'none',
      border: 'none',
      color: '#ff6b6b',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      padding: '0',
      marginTop: '5px',
      transition: 'color 0.2s ease',
    },
    helpfulSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginTop: '15px',
      paddingTop: '15px',
      borderTop: '1px solid #f0f0f0',
    },
    helpfulBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      background: 'none',
      border: '1px solid #e0e0e0',
      borderRadius: '20px',
      padding: '6px 12px',
      fontSize: '13px',
      color: '#666',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    form: {
      marginTop: '40px',
      padding: isMobile ? '20px' : '30px',
      backgroundColor: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0',
    },
    formTitle: {
      fontSize: isMobile ? '20px' : '22px',
      marginBottom: '20px',
      color: '#2d3436',
      fontWeight: '600',
    },
    ratingSelector: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    ratingOption: (selected) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '5px',
      padding: '10px 15px',
      border: selected ? '2px solid #ff6b6b' : '1px solid #e0e0e0',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: selected ? '#fff5f5' : 'white',
      minWidth: isMobile ? '60px' : '80px',
    }),
    ratingStars: {
      fontSize: isMobile ? '16px' : '18px',
    },
    ratingLabel: {
      fontSize: '12px',
      color: '#666',
    },
    textarea: {
      width: '100%',
      padding: isMobile ? '15px' : '16px',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      marginBottom: '20px',
      fontSize: isMobile ? '15px' : '16px',
      fontFamily: 'inherit',
      resize: 'vertical',
      transition: 'border-color 0.2s ease',
      outline: 'none',
    },
    textareaFocus: {
      borderColor: '#ff6b6b',
      boxShadow: '0 0 0 3px rgba(255,107,107,0.1)',
    },
    submitBtn: {
      padding: isMobile ? '14px 24px' : '14px 32px',
      background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(255,107,107,0.3)',
      width: isMobile ? '100%' : 'auto',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '60px',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #ff6b6b',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 15px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '50px',
      color: '#666',
      backgroundColor: '#f9f9f9',
      borderRadius: '16px',
      fontSize: isMobile ? '15px' : '16px',
    },
    loginPrompt: {
      textAlign: 'center',
      padding: '30px',
      backgroundColor: '#f9f9f9',
      borderRadius: '16px',
      color: '#666',
      marginTop: '20px',
    },
    loginLink: {
      color: '#ff6b6b',
      cursor: 'pointer',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#666' }}>Loading reviews...</p>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={styles.container}>
      {/* Header with stats */}
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Customer Reviews</h3>
          <div style={styles.titleAccent}></div>
        </div>
        
        {reviews.length > 0 && (
          <div style={styles.stats}>
            <div style={styles.averageRating}>
              <span style={styles.averageNumber}>{averageRating}</span>
              <div>
                {renderStars(Math.round(averageRating))}
                <span style={styles.totalReviews}>
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Reviews Grid */}
      {reviews.length > 0 ? (
        <div style={styles.reviewsGrid}>
          {reviews.map((review) => {
            const isExpanded = expandedReviews[review._id];
            const avatarColor = getAvatarColor(review.userName);
            
            return (
              <div
                key={review._id}
                style={styles.reviewCard}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    Object.assign(e.currentTarget.style, styles.reviewCardHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  }
                }}
              >
                <div style={styles.reviewHeader}>
                  <div style={styles.userInfo}>
                    <div style={{ ...styles.avatar, backgroundColor: avatarColor }}>
                      {getInitials(review.userName)}
                    </div>
                    <div style={styles.userDetails}>
                      <span style={styles.userName}>
                        {review.userName || 'Anonymous'}
                      </span>
                      <div style={styles.reviewMeta}>
                        <span style={styles.date}>
                          📅 {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        {review.verified && (
                          <span style={styles.verifiedBadge}>
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.rating}>
                  {renderStars(review.rating)}
                </div>

                <div style={styles.comment}>
                  <div style={isExpanded ? styles.commentExpanded : styles.commentCollapsed}>
                    {review.comment}
                  </div>
                  {review.comment.length > 150 && (
                    <button
                      style={styles.readMoreBtn}
                      onClick={() => toggleReview(review._id)}
                    >
                      {isExpanded ? 'Read less ↑' : 'Read more ↓'}
                    </button>
                  )}
                </div>

                <div style={styles.helpfulSection}>
                  <button
                    style={styles.helpfulBtn}
                    onClick={() => toast.info('Thanks for your feedback!')}
                  >
                    👍 Helpful ({Math.floor(Math.random() * 10) + 1})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>✨ No reviews yet</p>
          <p>Be the first to share your experience with this product!</p>
        </div>
      )}

      {/* Add Review Form */}
      {user ? (
        <form onSubmit={handleSubmitReview} style={styles.form}>
          <h4 style={styles.formTitle}>Write a Review</h4>
          
          {/* Rating Selector */}
          <div style={styles.ratingSelector}>
            {[5, 4, 3, 2, 1].map((star) => (
              <div
                key={star}
                style={styles.ratingOption(newReview.rating === star)}
                onClick={() => setNewReview({ ...newReview, rating: star })}
              >
                <span style={styles.ratingStars}>{'★'.repeat(star)}</span>
                <span style={styles.ratingLabel}>
                  {star === 5 ? 'Excellent' :
                   star === 4 ? 'Good' :
                   star === 3 ? 'Average' :
                   star === 2 ? 'Poor' : 'Terrible'}
                </span>
              </div>
            ))}
          </div>

          <textarea
            placeholder="What did you like or dislike? What would you recommend others know?"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            rows="4"
            style={styles.textarea}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff6b6b';
              e.target.style.boxShadow = '0 0 0 3px rgba(255,107,107,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0';
              e.target.style.boxShadow = 'none';
            }}
            required
          />

          <button
            type="submit"
            style={styles.submitBtn}
            disabled={submitting}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255,107,107,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(255,107,107,0.3)';
            }}
          >
            {submitting ? 'Posting...' : '📝 Post Review'}
          </button>
        </form>
      ) : (
        <div style={styles.loginPrompt}>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>
            Want to share your experience?
          </p>
          <p>
            Please{' '}
            <span 
              style={styles.loginLink}
              onClick={() => window.location.href = '/login'}
              onMouseEnter={(e) => e.target.style.color = '#ff5252'}
              onMouseLeave={(e) => e.target.style.color = '#ff6b6b'}
            >
              login
            </span>{' '}
            to write a review and help other shoppers!
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Reviews;