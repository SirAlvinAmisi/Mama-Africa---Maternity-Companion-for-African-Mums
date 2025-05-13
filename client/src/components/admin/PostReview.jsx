import { useEffect, useState } from "react";
import axios from "axios";

const PostReview = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  // const fetchFlaggedContent = async () => {
  //   try {
  //     const token = localStorage.getItem("access_token");
  //     const response = await axios.get("http://localhost:5000/flags", {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     const flagList = response.data.flags || [];

  //     const detailedFlags = await Promise.all(
  //       flagList.map(async (flag) => {
  //         if (!flag.content_id) return null;

  //         let data = null;
  //         try {
  //           if (flag.content_type === "post") {
  //             const res = await axios.get(`http://localhost:5000/admin/posts/${flag.content_id}`, {
  //               headers: { Authorization: `Bearer ${token}` }
  //             });
  //             data = res.data.post;
  //           } else if (flag.content_type === "comment") {
  //             const res = await axios.get(`http://localhost:5000/admin/comments/${flag.content_id}`, {
  //               headers: { Authorization: `Bearer ${token}` }
  //             });
  //             data = res.data.comment;
  //           }
  //         } catch (err) {
  //           console.warn(`Error loading flagged ${flag.content_type}:`, err);
  //         }

  //         return data ? { ...flag, data } : null;
  //       })
  //     );

  //     setFlags(detailedFlags.filter(Boolean)); // ✅ filter out nulls
  //   } catch (error) {
  //     console.error("Error fetching flagged content:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchFlaggedContent = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:5000/flags", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const flagList = response.data.flags || [];

      const detailedFlags = await Promise.all(
        flagList.map(async (flag) => {
          if (!flag.content_id) return null;  // skip if no content id

          let data = null;
          try {
            if (flag.content_type === "post") {
              const res = await axios.get(`http://localhost:5000/admin/posts/${flag.content_id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              data = res.data?.post;
            } else if (flag.content_type === "comment") {
              const res = await axios.get(`http://localhost:5000/admin/comments/${flag.content_id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              data = res.data?.comment;
            }
          } catch (err) {
            console.warn(`⚠️ Error loading flagged ${flag.content_type} with ID ${flag.content_id}:`, err.response?.data || err.message);
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
      const token = localStorage.getItem("access_token");
      const endpoint = type === "post" ? "posts" : "comments";

      await axios.patch(`http://localhost:5000/admin/${endpoint}/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (flagId) {
        await axios.patch(`http://localhost:5000/flags/${flagId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} ${status} successfully`);
      fetchFlaggedContent();
    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
    }
  };

  useEffect(() => {
    fetchFlaggedContent();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading flagged content...</p>;
  if (!flags.length) return <p className="text-center text-gray-600">No flagged content found.</p>;

  return (
    <div className="space-y-4">
      {flags.map(({ id: flagId, reason, data, content_type }) => (
        <div key={`${content_type}-${data.id}`} className="p-4 border rounded shadow-sm bg-red-50">
          <h3 className="text-lg font-bold text-red-800">
            {content_type === 'post' ? data.title : 'Flagged Comment'}
          </h3>
          <p className="text-gray-700">{data.content}</p>
          <p className="text-sm text-gray-500">
            By: <span className="font-medium">{data.user?.full_name || "Unknown"}</span>
            {content_type === 'post' && ` | Community: ${data.community?.name || "N/A"}`}
          </p>
          <p className="text-xs text-red-600 font-semibold mt-1">Reason: {reason}</p>

          <div className="flex gap-4 mt-2">
            <button
              onClick={() => updateContentStatus(data.id, "approved", flagId, content_type)}
              className="bg-cyan-500 text-black px-4 py-2 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => updateContentStatus(data.id, "flagged", flagId, content_type)}
              className="bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Keep Flagged
            </button>
            <button
              onClick={() => updateContentStatus(data.id, "rejected", flagId, content_type)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostReview;
