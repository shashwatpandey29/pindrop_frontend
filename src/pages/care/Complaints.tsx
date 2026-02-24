import { useEffect, useState } from "react";
import API from "@/api/api";

interface Complaint {
  id: number;
  order_id: number;
  customer_id: number;
  customer_name: string;
  description: string;
  status: string;
  resolution_notes?: string;
  created_at: string;
}

export default function CareDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Modal State for Notes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [notesInput, setNotesInput] = useState("");

  const fetchComplaints = async () => {
    try {
      const res = await API.care.getComplaints();
      setComplaints(res.data);
    } catch (err) {
      setError("Failed to load customer complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusChange = async (complaintId: number, newStatus: string) => {
    setUpdatingId(complaintId);
    try {
      await API.care.updateComplaint(complaintId, newStatus, "");
      setComplaints((prev) =>
        prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c))
      );
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeComplaint) return;
    setUpdatingId(activeComplaint.id);
    
    try {
      await API.care.updateComplaint(activeComplaint.id, activeComplaint.status, notesInput);
      setComplaints((prev) =>
        prev.map((c) => (c.id === activeComplaint.id ? { ...c, resolution_notes: notesInput } : c))
      );
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed to save notes.");
    } finally {
      setUpdatingId(null);
    }
  };

  const openNotesModal = (complaint: Complaint) => {
    setActiveComplaint(complaint);
    setNotesInput(complaint.resolution_notes || "");
    setIsModalOpen(true);
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm(`Are you sure you want to cancel Order #${orderId}? This cannot be undone.`)) return;
    
    try {
      await API.care.cancelOrder(orderId);
      alert(`Order #${orderId} successfully cancelled and driver freed.`);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Could not cancel order. It may already be delivered or cancelled.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-red-100 text-red-800 border-red-200";
      case "In Progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Resolved": return "bg-green-100 text-green-800 border-green-200";
      case "Closed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 animate-pulse">
        <p className="text-lg font-medium">Loading support tickets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Support Center</h1>
          <p className="text-gray-500 mt-1">Manage customer complaints and order resolutions.</p>
        </div>
        <button 
          onClick={fetchComplaints}
          className="text-blue-600 bg-blue-50 px-4 py-2 rounded hover:bg-blue-100 font-medium transition-colors"
        >
          Refresh Tickets
        </button>
      </div>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {complaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-xl font-medium text-gray-600 mb-2">Inbox Zero!</p>
          <p className="text-sm text-gray-400">There are no active customer complaints.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {complaints.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border flex flex-col md:flex-row overflow-hidden">
              
              {/* Ticket Info Area */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-bold text-gray-800">Ticket #{ticket.id}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className="text-sm text-gray-500 ml-auto">
                      {new Date(ticket.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Customer: <strong className="text-gray-800">{ticket.customer_name}</strong> | 
                    Order Ref: <strong className="text-blue-600">#{ticket.order_id}</strong>
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4 text-gray-700">
                    <span className="font-semibold text-xs uppercase text-gray-500 block mb-1">Customer Issue:</span>
                    {ticket.description}
                  </div>

                  {ticket.resolution_notes && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4 text-green-800">
                      <span className="font-semibold text-xs uppercase text-green-600 block mb-1">Agent Notes:</span>
                      {ticket.resolution_notes}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => openNotesModal(ticket)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {ticket.resolution_notes ? "Edit Notes" : "+ Add Resolution Note"}
                  </button>
                </div>
              </div>

              {/* Actions Sidebar */}
              <div className="bg-gray-50 p-6 md:w-64 border-t md:border-t-0 md:border-l flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Update Status</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                    disabled={updatingId === ticket.id}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-700 disabled:opacity-50"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="mt-auto">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Urgent Actions</label>
                  <button
                    onClick={() => handleCancelOrder(ticket.order_id)}
                    className="w-full bg-white border border-red-300 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-50 transition-colors"
                  >
                    Cancel Order #{ticket.order_id}
                  </button>
                  <p className="text-xs text-gray-400 mt-2 text-center">Cancels order & frees the driver.</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Resolution Notes Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Resolution Notes for Ticket #{activeComplaint?.id}
            </h2>
            
            <textarea
              rows={4}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4"
              placeholder="Detail the steps taken to resolve this issue..."
            />

            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={updatingId === activeComplaint?.id}
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}