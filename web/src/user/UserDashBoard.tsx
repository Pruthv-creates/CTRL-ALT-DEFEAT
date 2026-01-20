import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { Clock, LogOut, Package, ShoppingBag, Calendar } from "lucide-react";

interface VisitHistoryItem {
  plantId: string;
  visitedAt: any;
  plantName: string;
  plantImage: string;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: any;
  items: any[];
}

const UserDashboard = () => {
  const [visitHistory, setVisitHistory] = useState<VisitHistoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'visits' | 'orders'>('visits');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data()?.username || "");
        }
      } else {
        navigate("/user-login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setLoading(false);
        return;
      }

      try {
        // Fetch visit history
        const userDoc = await getDoc(doc(db, "Users", uid));
        const visits = userDoc.data()?.visitHistory || [];
        setVisitHistory(visits);

        // Fetch recent orders
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Order));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (auth.currentUser) fetchHistory();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const groupVisitsByDate = (visits: VisitHistoryItem[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups: { [key: string]: VisitHistoryItem[] } = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Older: []
    };

    visits.forEach(visit => {
      const visitDate = visit.visitedAt?.toDate ? visit.visitedAt.toDate() : new Date(visit.visitedAt);

      if (visitDate >= today) {
        groups.Today.push(visit);
      } else if (visitDate >= yesterday) {
        groups.Yesterday.push(visit);
      } else if (visitDate >= weekAgo) {
        groups['This Week'].push(visit);
      } else {
        groups.Older.push(visit);
      }
    });

    return groups;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'delivered':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const groupedVisits = groupVisitsByDate(visitHistory);

  return (
    <div className="min-h-screen bg-[#f0ead8] p-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <p className="text-[#556b2f]/80 text-lg">
              Welcome back, <span className="font-semibold">{username}</span>!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-white/50 hover:bg-white/80 text-[#556b2f] px-6 py-2.5 rounded-full transition-all shadow-sm border border-[#556b2f]/20 font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('visits')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'visits'
                ? 'bg-[#556b2f] text-white shadow-lg'
                : 'bg-white/50 text-[#556b2f] hover:bg-white/80'
              }`}
          >
            <Clock size={20} />
            Recently Visited
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'orders'
                ? 'bg-[#556b2f] text-white shadow-lg'
                : 'bg-white/50 text-[#556b2f] hover:bg-white/80'
              }`}
          >
            <Package size={20} />
            Order History
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-[#fdfbf7] rounded-3xl p-8 shadow-sm border border-[#556b2f]/5 min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#556b2f]"></div>
            </div>
          ) : activeTab === 'visits' ? (
            // Visited Plants Section
            visitHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-[#556b2f]/10 rounded-full flex items-center justify-center mb-6">
                  <Clock size={48} className="text-[#556b2f]/40" />
                </div>
                <h3 className="text-xl font-medium text-[#556b2f] mb-2">
                  No visit history yet
                </h3>
                <p className="text-[#556b2f]/60 mb-8 max-w-md">
                  Start exploring our collection of medicinal plants. Your recently viewed plants will appear here!
                </p>
                <Link
                  to="/explore"
                  className="bg-[#556b2f] text-white px-8 py-3 rounded-full hover:bg-[#3e4e23] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium"
                >
                  Explore Plants
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedVisits).map(([period, visits]) =>
                  visits.length > 0 ? (
                    <div key={period}>
                      <h3 className="text-lg font-semibold text-[#556b2f] mb-4 flex items-center gap-2">
                        <Calendar size={20} />
                        {period}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {visits.map((visit, index) => (
                          <Link
                            key={`${visit.plantId}-${index}`}
                            to={`/plant/${visit.plantId}`}
                            className="bg-white rounded-xl p-4 hover:shadow-lg transition-all border border-[#556b2f]/10 hover:border-[#556b2f]/30"
                          >
                            <div className="flex gap-4">
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {visit.plantImage ? (
                                  <img
                                    src={visit.plantImage}
                                    alt={visit.plantName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    🌿
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow min-w-0">
                                <h4 className="font-semibold text-[#556b2f] truncate">
                                  {visit.plantName}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  {formatTime(visit.visitedAt)}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDate(visit.visitedAt)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )
          ) : (
            // Orders Section
            orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-[#556b2f]/10 rounded-full flex items-center justify-center mb-6">
                  <Package size={48} className="text-[#556b2f]/40" />
                </div>
                <h3 className="text-xl font-medium text-[#556b2f] mb-2">
                  No orders yet
                </h3>
                <p className="text-[#556b2f]/60 mb-8 max-w-md">
                  You haven't placed any orders. Start shopping to see your order history here!
                </p>
                <Link
                  to="/buy-plants"
                  className="bg-[#556b2f] text-white px-8 py-3 rounded-full hover:bg-[#3e4e23] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium"
                >
                  Browse Plants
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-[#556b2f] flex items-center gap-2">
                    <Package size={24} />
                    Recent Orders
                  </h2>
                  <Link
                    to="/orders"
                    className="text-[#556b2f] hover:underline font-medium"
                  >
                    View All Orders →
                  </Link>
                </div>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl p-6 border border-[#556b2f]/10 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Order ID</p>
                        <p className="font-mono font-semibold text-[#556b2f]">
                          {order.id.slice(0, 12)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Date</p>
                          <p className="font-semibold text-gray-700">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600">
                        <ShoppingBag size={18} />
                        <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-[#556b2f]">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
