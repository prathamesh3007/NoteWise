// src/components/UpdateNoteModal.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Share2, Star, Download, Play, Pause, ImageIcon, Copy, Maximize2 } from "lucide-react";
import formatDateTime from "../utils/timeFormator";

function UpdateNoteModal({ note, onClose, onUpdate }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [favorite, setFavorite] = useState(note.favorite || false);
  const [audioTranscription, setAudioTranscription] = useState(note.audioTranscription || "");
  const [activeTab, setActiveTab] = useState("notes");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState(note.imageUrls || []);
  const [date, setDate] = useState("");
  const [isFavourite, setIsFavourite] = useState(note.favorite || false);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const id = note._id;
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/notes/getNote/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200 && res.data.data) {
          setExistingImages(res.data.data.imageUrls || []);
          setDate(res.data.data.createdAt);
        }
      } catch (error) {
        console.error("Error fetching note details:", error);
      }
    };
    fetchNoteDetails();
  }, [note._id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      let response;
      if (selectedImages.length > 0) {
        const formData = new FormData();
        formData.append("id", note._id);
        formData.append("title", title);
        formData.append("content", content);
        formData.append("favorite", favorite);
        formData.append("audioTranscription", audioTranscription);
        selectedImages.forEach((file) => {
          formData.append("images", file);
        });
        formData.append("imageUrls", JSON.stringify(existingImages));
        response = await axios.put(`${process.env.REACT_APP_BASE_URL}/notes/update`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.put(`${process.env.REACT_APP_BASE_URL}/notes/update`, {
          id: note._id,
          title,
          content,
          favorite,
          audioTranscription,
          imageUrls: existingImages,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (response.status === 200) {
        toast.success("Note updated successfully");
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  const handleToggleFavourite = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/notes/toggleFavourite`, { id: note._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setIsFavourite((prev) => !prev);
        setFavorite(!favorite);
        toast.success("Favourite toggled successfully");
        onUpdate();
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
      toast.error("Failed to toggle favourite");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: content,
        url: window.location.href,
      })
      .then(() => toast.success("Note shared successfully!"))
      .catch((error) => {
        console.error("Error sharing:", error);
        toast.error("Failed to share note");
      });
    } else {
      navigator.clipboard.writeText(content);
      toast.success("Note content copied to clipboard!");
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(content);
    toast.success("Transcript copied to clipboard");
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages(filesArray);
    }
  };

  const removeExistingImage = (url) => {
    setExistingImages((prevImages) => prevImages.filter((img) => img !== url));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className={`fixed inset-0 flex items-center justify-center z-50 ${isFullscreen ? "p-0" : "p-4"}`}>
        <div
          className={`bg-white rounded-lg shadow-lg flex flex-col ${isFullscreen ? "w-full h-full rounded-none" : "w-11/12 max-w-4xl max-h-[90vh]"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-sm text-gray-500">{formatDateTime(date)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleToggleFavourite} className="p-2 hover:bg-gray-100 rounded-lg" title="Toggle Favourite">
                <Star size={20} className={isFavourite ? "text-yellow-500" : "text-gray-600"} />
              </button>
              <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-lg" title="Share Note">
                <Share2 size={20} className="text-gray-600" />
              </button>
              <button onClick={toggleFullscreen} className="p-2 hover:bg-gray-100 rounded-lg" title="Toggle Fullscreen">
                <Maximize2 size={20} className="text-gray-600" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" title="Close">
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {note.type === "audio" && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 hover:bg-gray-100 rounded-full">
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <div className="flex-1 h-1 bg-gray-200 rounded-full">
                  <div className="w-1/3 h-full bg-purple-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-500">00:00 / 00:09</span>
                <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Download size={16} />
                  Download Audio
                </button>
              </div>
            </div>
          )}

          <div className="flex border-b">
            {["notes", "transcript", "create", "speaker"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-auto">
            {activeTab === "notes" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notes</h3>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="4"
                ></textarea>
              </div>
            )}
            {["transcript", "create", "speaker"].includes(activeTab) && (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{activeTab === "create" ? "Create" : "Transcript"}</h3>
                  {activeTab === "transcript" && (
                    <button
                      onClick={handleCopyTranscript}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                  )}
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="4"
                ></textarea>
              </div>
            )}

            {activeTab !== "speaker" && (
              <div className="mt-4">
                <span className="text-sm text-gray-600">Existing Images:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {existingImages.length > 0 ? (
                    existingImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Note image ${index}`} className="w-20 h-20 object-cover rounded" />
                        <button
                          onClick={() => removeExistingImage(url)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No existing images</p>
                  )}
                </div>

                <span className="text-sm text-gray-600 mt-4 block">Add New Images:</span>
                <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer mt-2">
                  <ImageIcon size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Select Images</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>

                {selectedImages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="w-20 h-20 relative">
                        <img src={URL.createObjectURL(file)} alt={`Selected ${index}`} className="w-full h-full object-cover rounded" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t flex justify-end">
            <button onClick={handleUpdate} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default UpdateNoteModal;
