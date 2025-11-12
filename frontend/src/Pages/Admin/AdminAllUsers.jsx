import { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const AdminAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [sortConfig, setSortConfig] = useState({ key: "role", direction: "descending" });
  const [showConfirmation, setShowConfirmation] = useState({ show: false, userId: null, isBlocked: false });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user", password: "" });

const fetchUsers = async () => {
  try {
    setLoading(true);
    const res = await api.get("users/");
    const data = Array.isArray(res.data) ? res.data : [];

    const normalizeBool = val => {
      if (typeof val === "boolean") return val;
      if (typeof val === "string") {
        const low = val.toLowerCase();
        return low === "true" || low === "1";
      }
      if (typeof val === "number") return val === 1;
      return false;
    };

    const mapped = data.map(u => {
      const isBlockVal = u.isBlock ?? u.is_block ?? u.is_blocked ?? u.blocked;
      const isBlock = normalizeBool(isBlockVal);

      return {
        id: u.id,
        name: u.username || u.email || "Unknown",
        email: u.email || "",
        role: u.role || (u.is_superuser ? "admin" : "user"),
        isBlock,
        created_at: u.created_at || u.date_joined || null,
      };
    });

    setUsers(mapped);
    setError(null);
    toast.success("Users loaded successfully!");
  } catch (err) {
    setError("Failed to load users. Please try again later.");
    toast.error("Failed to load users. Please try again!");
  } finally {
    setLoading(false);
  }
};


const toggleBlockUser = async (userId, isCurrentlyBlocked) => {
  try {
    const endpoint = isCurrentlyBlocked ? `users/${userId}/unblock_user/` : `users/${userId}/block_user/`;
    const res = await api.patch(endpoint);

    const resp = res.data ?? {};
    const newStatus =
      resp.isBlock ??
      resp.is_block ??
      resp.is_blocked ??
      resp.blocked ??
      !isCurrentlyBlocked;

    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, isBlock: Boolean(newStatus) } : u))
    );

    setShowConfirmation({ show: false, userId: null, isBlocked: false });
    toast.success(newStatus ? "User blocked successfully!" : "User unblocked successfully!");
  } catch (err) {
    toast.error("Failed to update user status. Please try again!");
  }
};


  const handleNewUserChange = e => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const submitNewUser = async () => {
    try {
      const payload = {
        username: newUser.name.trim(),
        email: newUser.email.trim(),
        password: newUser.password,
        role: newUser.role,
        is_staff: newUser.role === "admin",
        is_superuser: newUser.role === "admin",
      };

      const res = await api.post("admin/users/", payload);
      const addedUser = {
        id: res.data.id,
        name: res.data.username,
        email: res.data.email,
        role: res.data.role || "user",  
        isBlock: res.data.isBlock || false,
        created_at: res.data.created_at,
      };

      setUsers(prev => [...prev, addedUser]);
      setShowAddUserModal(false);
      setNewUser({ name: "", email: "", role: "user", password: "" });
      toast.success("User added successfully!");
    } catch (err) {
      if (err.response) {
        toast.error("Failed to add user: " + Object.values(err.response.data).flat().join(", "));
      } else {
        toast.error("Failed to add user. Please try again!");
      }
    }
  };

  const handleEditClick = user => setEditingUser({ ...user });

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditingUser(prev => ({ ...prev, [name]: value }));
  };

  const submitEditUser = async () => {
    try {
      const payload = {
        username: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        isBlock: editingUser.isBlock,
      };

      const res = await api.patch(`users/${editingUser.id}/`, payload);
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...res.data } : u));
      setEditingUser(null);
      toast.success("User updated successfully!");
    } catch (err) {
      toast.error("Failed to update user. Please try again!");
    }
  };

  const requestSort = key => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") direction = "descending";
    setSortConfig({ key, direction });
  };

  const getSortedUsers = () => {
    const sortableUsers = [...users];
    return sortableUsers.sort((a, b) => {
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (b.role === "admin" && a.role !== "admin") return 1;
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  };

  const getFilteredUsers = () => {
    const sortedUsers = getSortedUsers();
    if (!searchTerm) return sortedUsers;
    return sortedUsers.filter(
      user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = getFilteredUsers().slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(getFilteredUsers().length / usersPerPage);
  const paginate = pageNumber => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  useEffect(() => { fetchUsers(); }, []);

  const formatDate = dateString => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const formatRelativeTime = dateString => {
    const diffDays = Math.ceil(Math.abs(new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "today" : diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      <span className="ml-4 text-gray-700 text-xl">Loading users...</span>
    </div>
  );

  if (error) return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
        <button onClick={fetchUsers} className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Retry</button>
      </div>
    </div>
  );  

  return (
    <div className="min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">User Management</h2>
            <p className="text-gray-500 mt-1">
              Manage all registered users ({users.length} total)
            </p>
          </div>
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold mt-1">{users.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Active Users</p>
                <p className="text-2xl font-bold mt-1">{users.filter(u => !u.isBlock).length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Blocked Users</p>
                <p className="text-2xl font-bold mt-1">{users.filter(u => u.isBlock).length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Admin Users</p>
                <p className="text-2xl font-bold mt-1">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 7a7 7 0 0 0 7 7m2 0a9 9 0 0 1-9 9m-4 0a9 9 0 0 1-9-9" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="py-4 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer"
                    onClick={() => requestSort("id")}
                  >
                    <div className="flex items-center">
                      ID
                      {sortConfig.key === "id" && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ml-1 ${sortConfig.direction === "ascending" ? "" : "transform rotate-180"}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-4 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center">
                      User
                      {sortConfig.key === "name" && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ml-1 ${sortConfig.direction === "ascending" ? "" : "transform rotate-180"}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-4 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer"
                    onClick={() => requestSort("email")}
                  >
                    <div className="flex items-center">
                      Email
                      {sortConfig.key === "email" && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ml-1 ${sortConfig.direction === "ascending" ? "" : "transform rotate-180"}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                    Role
                  </th>
                  <th 
                    className="py-4 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer"
                    onClick={() => requestSort("created_at")}
                  >
                    <div className="flex items-center">
                      Joined
                      {sortConfig.key === "created_at" && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ml-1 ${sortConfig.direction === "ascending" ? "" : "transform rotate-180"}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 px-6 text-center text-gray-500">
                      No users found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6">{user.id}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="bg-gray-200 rounded-full w-10 h-10 mr-3 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">@{(user.name || "").toLowerCase().replace(/\s+/g, '')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin" 
                            ? "bg-purple-100 text-purple-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">{formatDate(user.created_at)}</div>
                        <div className="text-xs text-gray-500">{formatRelativeTime(user.created_at)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.isBlock 
                            ? "bg-red-100 text-red-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            user.isBlock ? "bg-red-500" : "bg-green-500"
                          }`}></span>
                          {user.isBlock ? "Blocked" : "Active"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setShowConfirmation({
                              show: true,
                              userId: user.id,
                              isBlocked: user.isBlock
                            })}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                              user.isBlock 
                                ? "bg-green-600 hover:bg-green-700 text-white" 
                                : "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                          >
                            {user.isBlock ? "Unblock" : "Block"}
                          </button>
                          <button 
                            onClick={() => handleEditClick(user)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500 mb-4 md:mb-0">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, getFilteredUsers().length)} of {getFilteredUsers().length} users
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === number 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Add New User</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitNewUser}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Edit User: {editingUser.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingUser.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={editingUser.role}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="isBlock"
                  value={String(editingUser.isBlock)}
                  onChange={(e) =>
                    setEditingUser(prev => ({ ...prev, isBlock: e.target.value === "true" }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="false">Active</option>
                  <option value="true">Blocked</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditingUser(null)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitEditUser}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mt-4">
                {showConfirmation.isBlocked ? "Unblock User?" : "Block User?"}
              </h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to {showConfirmation.isBlocked ? "unblock" : "block"} this user? 
                {showConfirmation.isBlocked ? " They will regain access to their account." : " They will no longer be able to access their account."}
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmation({ show: false, userId: null, isBlocked: false })}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => toggleBlockUser(showConfirmation.userId, showConfirmation.isBlocked)}
                  className={`px-5 py-2 rounded-lg font-medium ${
                    showConfirmation.isBlocked 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {showConfirmation.isBlocked ? "Yes, Unblock" : "Yes, Block"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllUsers;