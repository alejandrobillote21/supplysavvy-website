/* userlist.jsx */

import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import "./css_style/userlist.css";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableFields, setEditableFields] = useState({
    idNumber: "",
    firstName: "",
    lastName: "",
    userEmail: "",
    userMobile: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        refetch();
        toast.success("User deleted successfully!");
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (user) => {
    setEditableUserId(user._id);
    setEditableFields({
      idNumber: user.id_number,
      firstName: user.firstname,
      lastName: user.lastname,
      userEmail: user.email,
      userMobile: user.mobile,
    });
  };

  const updateHandler = async (id) => {
    try {
      const updatedUser = {
        userId: id,
        id_number: editableFields.idNumber,
        firstname: editableFields.firstName,
        lastname: editableFields.lastName,
        email: editableFields.userEmail,
        mobile: editableFields.userMobile,
      };
      console.log("Updating user with payload:", updatedUser);
      await updateUser(updatedUser).unwrap();
      setEditableUserId(null);
      refetch();
      toast.success("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const isAdminStyle = (isAdmin) => {
    return isAdmin ? "text-green-500" : "text-red-500";
  };

  const filteredUsers = users
    ? users.filter((user) =>
        user.id_number.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="userlist-container">
      <h1 className="section-header">User List</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div>
          <AdminMenu />
          <input
            className="userlist-search"
            type="text"
            placeholder="Search by ID Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <table className="userlist-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ID NUMBER</th>
                <th>FIRST NAME</th>
                <th>LAST NAME</th>
                <th>EMAIL</th>
                <th>MOBILE NUMBER</th>
                <th>ADMIN</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-dark-cerulean" : "bg-light-amber"
                  }`}
                >
                  <td>{user._id}</td>
                  <td>
                    {editableUserId === user._id ? (
                      <div>
                        <input
                          className="userlist-edit-input"
                          type="text"
                          value={editableFields.idNumber}
                          onChange={(e) =>
                            setEditableFields({
                              ...editableFields,
                              idNumber: e.target.value,
                            })
                          }
                        />
                        <button
                          className="userlist-edit-button"
                          onClick={() => updateHandler(user._id)}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div>
                        {user.id_number}{" "}
                        <button
                          className="userlist-action-button"
                          onClick={() => toggleEdit(user)}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    {editableUserId === user._id ? (
                      <div>
                        <input
                          className="userlist-edit-input"
                          type="text"
                          value={editableFields.firstName}
                          onChange={(e) =>
                            setEditableFields({
                              ...editableFields,
                              firstName: e.target.value,
                            })
                          }
                        />
                        <button
                          className="userlist-edit-button"
                          onClick={() => updateHandler(user._id)}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div>
                        {user.firstname}{" "}
                        <button
                          className="userlist-action-button"
                          onClick={() => toggleEdit(user)}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    {editableUserId === user._id ? (
                      <div>
                        <input
                          className="userlist-edit-input"
                          type="text"
                          value={editableFields.lastName}
                          onChange={(e) =>
                            setEditableFields({
                              ...editableFields,
                              lastName: e.target.value,
                            })
                          }
                        />
                        <button
                          className="userlist-edit-button"
                          onClick={() => updateHandler(user._id)}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div>
                        {user.lastname}{" "}
                        <button
                          className="userlist-action-button"
                          onClick={() => toggleEdit(user)}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    {editableUserId === user._id ? (
                      <div>
                        <input
                          className="userlist-edit-input"
                          type="text"
                          value={editableFields.userEmail}
                          onChange={(e) =>
                            setEditableFields({
                              ...editableFields,
                              userEmail: e.target.value,
                            })
                          }
                        />
                        <button
                          className="userlist-edit-button"
                          onClick={() => updateHandler(user._id)}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <a
                          href={`mailto:${user.email}`}
                          className="userlist-action-link"
                        >
                          {user.email}
                        </a>{" "}
                        <button
                          className="userlist-action-button"
                          onClick={() => toggleEdit(user)}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    {editableUserId === user._id ? (
                      <div>
                        <input
                          className="userlist-edit-input"
                          type="text"
                          value={editableFields.userMobile}
                          onChange={(e) =>
                            setEditableFields({
                              ...editableFields,
                              userMobile: e.target.value,
                            })
                          }
                        />
                        <button
                          className="userlist-edit-button"
                          onClick={() => updateHandler(user._id)}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div>
                        {user.mobile}{" "}
                        <button
                          className="userlist-action-button"
                          onClick={() => toggleEdit(user)}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    <div>
                      <span className={isAdminStyle(user.isAdmin)}>
                        {user.isAdmin ? <FaCheck /> : <FaTimes />}
                      </span>
                    </div>
                  </td>
                  <td>
                    {!user.isAdmin && (
                      <button
                        className="userlist-action-button"
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
