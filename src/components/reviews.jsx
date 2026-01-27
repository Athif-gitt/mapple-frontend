import { useEffect, useState } from "react";
import { getReviews, addReview } from "@/api/reviews";

function StarRating({ rating, setRating, interactive = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && setRating(star)}
          className={`text-2xl transition ${
            star <= rating ? "text-yellow-400" : "text-slate-300"
          } ${interactive && "hover:scale-110"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function Reviews({ productId, isLoggedIn }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const res = await getReviews(productId);
    setReviews(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await addReview(productId, { rating, comment });
      setRating(5);
      setComment("");
      fetchReviews();
    } catch (err) {
      const data = err.response?.data;
      if (data?.non_field_errors) setError(data.non_field_errors[0]);
      else if (data?.rating) setError(data.rating[0]);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12">
      <div className="text-center mb-8">
  <h2 className="text-2xl font-bold text-slate-800">
    Customer Reviews
  </h2>
  <div className="mt-2 flex justify-center">
    {/* <span className="h-1 w-16 rounded-full bg-indigo-500"></span> */}
  </div>
</div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.length === 0 && (
          <div className="text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center">
            No reviews yet. Be the first to share your thoughts.
          </div>
        )}

        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                {review.user[0].toUpperCase()}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-800">
                  {review.user}
                </p>
                <StarRating rating={review.rating} />
              </div>

              <span className="text-xs text-slate-400">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>

            {review.comment && (
              <p className="mt-3 text-slate-600 leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add review */}
      {isLoggedIn && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6"
        >
          <h3 className="font-semibold text-lg mb-3">
            Write a review
          </h3>

          <StarRating rating={rating} setRating={setRating} interactive />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience (optional)"
            className="w-full mt-4 p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows={4}
          />

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <button
            disabled={loading}
            className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {!isLoggedIn && (
        <p className="mt-6 text-slate-500 text-sm">
          Please log in to write a review.
        </p>
      )}
    </section>
  );
}

export default Reviews;
