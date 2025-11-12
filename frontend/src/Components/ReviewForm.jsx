import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";

const ReviewForm = ({ productId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to submit a review");
    if (rating === 0) return alert("Please select a rating");

    const newReview = {
      rating,
      comment,
      username: user.name || "Anonymous"
    };

    onReviewSubmit(newReview);

    setRating(0);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex space-x-2 text-3xl mb-2">
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`cursor-pointer ${star <= (hover || rating) ? "text-yellow-400" : "text-gray-400"}`}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="w-full border border-gray-300 rounded p-2 mb-2"
        required
      />

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
