import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById, updateBookingStatus, updateBookingImages, updateJobNotes } from "../../services/bookingService";

const statusColors = {
  requested: "bg-yellow-50 text-yellow-600 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-600 border-blue-200",
  "in-progress": "bg-purple-50 text-purple-600 border-purple-200",
  completed: "bg-green-50 text-green-600 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const timelineSteps = ["requested", "confirmed", "in-progress", "completed"];

const stepLabels = {
  requested: "Booking Requested",
  confirmed: "Booking Confirmed",
  "in-progress": "Work In Progress",
  completed: "Job Completed",
};

const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, "0")} ${ampm}`;
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [showUpdateNotes, setShowUpdateNotes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalImage, setModalImage] = useState(null);

  const [jobNotes, setJobNotes] = useState("");
  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);


  const beforePreviews = useMemo(() =>
    beforeImages.map((file) => URL.createObjectURL(file)),
    [beforeImages]
  );

  const afterPreviews = useMemo(() =>
    afterImages.map((file) => URL.createObjectURL(file)),
    [afterImages]
  );

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await getBookingById(id);
        setBooking(response.booking);
        setJobNotes(response.booking.jobNotes || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    setError("");
    setActionLoading(true);
    try {
      const response = await updateBookingStatus(id, { status, jobNotes });
      setBooking(response.booking);
      setShowUpdateNotes(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleNotesUpdate = async () => {
    setError("");
    setActionLoading(true);
    try {
      const response = await updateJobNotes(id, { jobNotes });
      setBooking(response.booking);
      setShowUpdateNotes(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleImagesUpdate = async () => {
    setError("");
    setActionLoading(true);
    try {
      const data = new FormData();
      beforeImages.forEach((file) => data.append("beforeImages", file));
      afterImages.forEach((file) => data.append("afterImages", file));
      if (jobNotes) data.append("jobNotes", jobNotes);
      const response = await updateBookingImages(id, data);
      setBooking(response.booking);
      setBeforeImages([]);
      setAfterImages([]);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const getStepIndex = (status) => timelineSteps.indexOf(status);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Booking not found</div>
  );

  const currentStepIndex = getStepIndex(booking.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

     
        <button onClick={() => navigate("/provider/dashboard")} className="text-sm text-gray-500 hover:text-black mb-6 flex items-center gap-1">
          ← Back to Dashboard
        </button>

     
        <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-black text-gray-900">{booking.customerId.name || "Customer Unavaiable"}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{booking.categoryId.name || "N/A"} · {booking.address}</p>
            </div>
            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${statusColors[booking.status]}`}>
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Date</p>
              <p className="text-sm font-medium text-gray-800">{new Date(booking.scheduledDate).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Time</p>
              <p className="text-sm font-medium text-gray-800">{formatTime(booking.scheduledTime)}</p>
            </div>
          </div>

          {booking.problemDescription && (
            <div className="mt-3 bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Problem</p>
              <p className="text-sm text-gray-700">{booking.problemDescription}</p>
            </div>
          )}

          {booking.customerImage && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-1.5">Customer Image</p>
              <img
                src={booking.customerImage}
                alt="customer"
                onClick={() => setModalImage(booking.customerImage)}
                className="w-full rounded-xl object-cover max-h-40 cursor-pointer hover:opacity-90 transition"
              />
            </div>
          )}
        </div>

     
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 border border-red-100">
            {error}
          </div>
        )}

   
        {booking.status !== "cancelled" && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-4">
            <h2 className="text-sm font-bold text-gray-900 mb-6">Job Progress</h2>

            <div className="relative">
              {timelineSteps.map((step, index) => {
                const isDone = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;
                const isLast = index === timelineSteps.length - 1;

                return (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all
                        ${isDone ? "bg-black text-white" : ""}
                        ${isCurrent ? "bg-black text-white ring-4 ring-gray-200" : ""}
                        ${isPending ? "bg-gray-100 text-gray-400" : ""}
                      `}>
                        {isDone ? "✓" : index + 1}
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-10 mt-1 ${isDone ? "bg-black" : "bg-gray-200"}`} />
                      )}
                    </div>

                    <div className="flex-1 pb-8">
                      <p className={`text-sm font-semibold ${isPending ? "text-gray-400" : "text-gray-900"}`}>
                        {stepLabels[step]}
                      </p>
                      {isCurrent && <p className="text-xs text-gray-400 mt-0.5">Current stage</p>}
                      {isDone && <p className="text-xs text-gray-400 mt-0.5">Completed</p>}

                      {isCurrent && (
                        <div className="mt-3">

                        
                          {booking.status === "requested" && (
                            <div className="flex gap-2">
                              <button onClick={() => handleStatusUpdate("confirmed")} disabled={actionLoading}
                                className="flex-1 bg-black text-white py-2 rounded-xl text-xs font-medium hover:bg-gray-900 transition disabled:opacity-50">
                                Accept
                              </button>
                              <button onClick={() => handleStatusUpdate("cancelled")} disabled={actionLoading}
                                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-xs font-medium hover:bg-gray-50 transition disabled:opacity-50">
                                Reject
                              </button>
                            </div>
                          )}

                     
                          {booking.status === "confirmed" && (
                            <button onClick={() => handleStatusUpdate("in-progress")} disabled={actionLoading}
                              className="w-full bg-black text-white py-2 rounded-xl text-xs font-medium hover:bg-gray-900 transition disabled:opacity-50">
                              Start Work
                            </button>
                          )}

                    
                          {booking.status === "in-progress" && (
                            <div className="space-y-4">

                              <div>
                                <label className="text-xs font-medium text-gray-700 block mb-1">Job Notes</label>
                                <textarea value={jobNotes} onChange={(e) => setJobNotes(e.target.value)}
                                  placeholder="Describe what was done..." rows={2}
                                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black transition resize-none" />
                              </div>

                          
                              <div>
                                <label className="text-xs font-medium text-gray-700 block mb-1">Before Images</label>
                                <input type="file" accept="image/*" multiple
                                 onChange={(e) =>
                                  setBeforeImages((prev) => [
                                                 ...prev,
                                   ...Array.from(e.target.files)
  ])
}
                                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs"
                                />
                                {beforePreviews.length > 0 && (
                                  <div className="flex gap-2 flex-wrap mt-2">
                                    {beforePreviews.map((url, i) => (
                                      <div key={i} className="relative">
                                        <img src={url} alt="before preview"
                                          onClick={() => setModalImage(url)}
                                          className="w-20 h-20 object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition"
                                        />
                                        <button
                                          onClick={() => setBeforeImages(beforeImages.filter((_, idx) => idx !== i))}
                                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                                        >✕</button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                    
                              <div>
                                <label className="text-xs font-medium text-gray-700 block mb-1">After Images</label>
                                <input type="file" accept="image/*" multiple
                                    onChange={(e) =>
                                       setAfterImages((prev) => [
                                                   ...prev,
                                         ...Array.from(e.target.files)
                                                 ])
                                              }

                                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs"
                                />
                                {afterPreviews.length > 0 && (
                                  <div className="flex gap-2 flex-wrap mt-2">
                                    {afterPreviews.map((url, i) => (
                                      <div key={i} className="relative">
                                        <img src={url} alt="after preview"
                                          onClick={() => setModalImage(url)}
                                          className="w-20 h-20 object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition"
                                        />
                                        <button
                                          onClick={() => setAfterImages(afterImages.filter((_, idx) => idx !== i))}
                                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                                        >✕</button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
                                <p className="text-xs text-yellow-700 font-medium">⚠️ Once submitted, images cannot be changed</p>
                                <p className="text-xs text-yellow-600 mt-0.5">These become permanent proof of service</p>
                              </div>

                              {(!beforeImages.length || !afterImages.length) && (
                                <p className="text-xs text-gray-400">* Before and after images required</p>
                              )}

                              <button onClick={handleImagesUpdate}
                                disabled={actionLoading || !beforeImages.length || !afterImages.length}
                                className="w-full bg-black text-white py-2.5 rounded-xl text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                                {actionLoading ? "Uploading..." : "Submit & Complete Job"}
                              </button>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

     
        {booking.status === "completed" && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Job Summary</h2>
              <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Service Record</span>
            </div>

            {booking.jobNotes && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Job Notes</p>
                <p className="text-sm text-gray-700">{booking.jobNotes}</p>
              </div>
            )}

            {booking.beforeImages?.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Before Images</p>
                <div className="flex gap-2 flex-wrap">
                  {booking.beforeImages.map((img, i) => (
                    <img key={i} src={img} alt="before"
                      onClick={() => setModalImage(img)}
                      className="w-24 h-24 object-cover rounded-xl cursor-pointer hover:opacity-90 transition"
                    />
                  ))}
                </div>
              </div>
            )}

            {booking.afterImages?.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">After Images</p>
                <div className="flex gap-2 flex-wrap">
                  {booking.afterImages.map((img, i) => (
                    <img key={i} src={img} alt="after"
                      onClick={() => setModalImage(img)}
                      className="w-24 h-24 object-cover rounded-xl cursor-pointer hover:opacity-90 transition"
                    />
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setShowUpdateNotes(!showUpdateNotes)}
              className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              {showUpdateNotes ? "Cancel" : "Update Job Notes"}
            </button>

            {showUpdateNotes && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <textarea value={jobNotes} onChange={(e) => setJobNotes(e.target.value)}
                  placeholder="Update job notes..." rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none" />
                <button onClick={handleNotesUpdate} disabled={actionLoading || !jobNotes.trim()}
                  className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  {actionLoading ? "Saving..." : "Save Notes"}
                </button>
              </div>
            )}
          </div>
        )}

   
        {booking.status === "cancelled" && (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-center">
            <p className="text-2xl mb-2">❌</p>
            <p className="text-sm font-semibold text-red-600">Booking Cancelled</p>
            <p className="text-xs text-red-400 mt-1">This booking has been cancelled</p>
          </div>
        )}

      </div>

  
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="full view" className="w-full max-h-screen object-contain rounded-2xl" />
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition"
            >✕</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobDetail;