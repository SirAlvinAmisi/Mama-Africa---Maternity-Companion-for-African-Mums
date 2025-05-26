import { useEffect, useState } from "react";
import {
  getFlaggedItems,
  getFlaggedPost,
  getFlaggedComment,
  updateFlagStatus,
  updatePostOrCommentStatus,
} from "../../lib/api";

const PostReview = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlaggedContent = async () => {
    try {
      const flagList = await getFlaggedItems();

      const detailedFlags = await Promise.all(
        flagList.map(async (flag) => {
          if (!flag.content_id) return null;

          let data = null;
          try {
            if (flag.content_type === "post") {
              data = await getFlaggedPost(flag.content_id);
            } else if (flag.content_type === "comment") {
              data = await getFlaggedComment(flag.content_id);
            }
          } catch (err) {
            console.warn(
              `⚠️ Error loading flagged ${flag.content_type} with ID ${flag.content_id}:`,
              err.response?.data || err.message
            );
          }

          return data ? { ...flag, data } : null;
        })
      );

      setFlags(detailedFlags.filter(Boolean));
    } catch (error) {
      console.error("Error fetching flagged content:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateContentStatus = async (id, status, flagId, type) => {
    try {
      await updatePostOrCommentStatus(type, id, status);
      if (flagId) await updateFlagStatus(flagId);

      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} ${status} successfully`);
      fetchFlaggedContent();
    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
    }
  };

  useEffect(() => {
    fetchFlaggedContent();
  }, []);

  if (loading) return <p className="text-center text-cyan-600 font-medium">Loading flagged content...</p>;
  if (!flags.length) return <p className="text-center text-gray-500">No flagged content found.</p>;

  return (
    <div className="space-y-6 bg-white text-black p-4 sm:p-6 rounded-xl shadow-md">
      {flags.map(({ id: flagId, reason, data, content_type }) => (
        <div
          key={`${content_type}-${data.id}`}
          className="p-5 border border-gray-200 rounded-xl shadow-sm bg-gradient-to-br from-red-50 to-white hover:shadow-lg transition duration-200"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-purple-800 mb-2">
            {content_type === "post" ? data.title : "🚩 Flagged Comment"}
          </h3>

          <p className="text-gray-700 mb-2">{data.content}</p>

          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-black">By:</span> {data.user?.full_name || "Unknown"}
            {content_type === "post" && (
              <span className="ml-2 text-gray-500">
                | Community: <span className="font-semibold text-cyan-700">{data.community?.name || "N/A"}</span>
              </span>
            )}
          </p>

          <p className="text-xs text-red-700 font-semibold">Reason: {reason}</p>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => updateContentStatus(data.id, "approved", flagId, content_type)}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition"
            >
              ✅ Approve
            </button>

            <button
              onClick={() => updateContentStatus(data.id, "flagged", flagId, content_type)}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
            >
              🚩 Keep Flagged
            </button>

            <button
              onClick={() => updateContentStatus(data.id, "rejected", flagId, content_type)}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostReview;
