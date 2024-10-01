import React, { useEffect, useState } from "react";
import { createData, deleteData, fetchData, updateData } from "../service/Api";
import { useNavigate } from "react-router-dom";
import { GenericHTMLFormElement } from "axios";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
import { ToastContainer, toast } from "react-toastify";
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}
function ListUser() {
  const [users, setUsers] = useState<User []>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false); 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [editingUserId, setEditingUserId] = useState<number | null>(null); // Track the post being edited
  const [newUser, setNewUser] = useState({
    id: 0,
    name: "",
    email:"",
    phone: "",
    website: "",
    address: "",
    company: "",

    
  })


  const getUser = async () => {
    const response = await fetchData("/users");
    if (response.error) {
      setError(response.error);
    } else {
      setUsers(response);
    }
  };

  const handleUser = (userid : number) => {
    navigate(`/viewuserdetail/${userid}`, { state: { userid } });
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const searchUser = async () => {
    if (searchInput === "") {
      getUser();
    } else {
      try {
        const response = await fetchData(`/users?name=${searchInput}`);
        if (response.error) {
          setError(response.error);
        } else {
          setUsers(response);
        }
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditMode && editingUserId !== null) {
      // Update mode
      const endpoint = `/users/${editingUserId}`;
      const response = await updateData(endpoint, newUser);

      if ("error" in response) {
        console.error("Error updating post", response.error);
        setError(response.error);
      } else {
        setUsers(
          users.map((user) =>
            user.id === editingUserId ? { ...user, ...newUser } : user
          )
        );
        setShow(false);
        toast.success("Post updated successfully!");
      }
    } else {
      // Create mode
      const endpoint = "/users";
      const response = await createData(endpoint, newUser);

      if ("error" in response) {
        console.error("Error creating post", response.error);
        setError(response.error);
      } else {
        const createdUser = {  ...newUser, id: Date.now() };
        setUsers([createdUser, ...users]);
        setShow(false);
        toast.success("Post created successfully!");
      }
    }

    setIsEditMode(false); // Reset the edit mode
    setEditingUserId(null); // Reset the post being edited
  };

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setNewUser({
    ...newUser,
    [e.target.id]: e.target.value,
  });
};
const handleEdit = (user: User) => {
  setIsEditMode(true);
  setEditingUserId(user.id);
  setNewUser({
    id: user.id,
    name: newUser.name,
    email:newUser.email,
    phone: newUser.phone,
    website: newUser.website,
    address: newUser.address,
    company: newUser.company,
  });
  handleShow();
};
const handleDelete = async (userId: number) => {
  const response = await deleteData(`/users/${userId}`);
  if ("error" in response) {
    console.error("Error deleting post", response.error);
    setError(response.error);
  } else {
    setUsers(users.filter((user) => user.id !== userId));
    toast.success("Post deleted successfully!");
  }
};
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex flex-col">
      <ToastContainer/>
      <div className="relative max-w-sm mx-auto mt-20">
        <input
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          placeholder="Search"
        />
        <button
          onClick={searchUser}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.795 13.408l5.204 5.204a1 1 0 01-1.414 1.414l-5.204-5.204a7.5 7.5 0 111.414-1.414zM8.5 14A5.5 5.5 0 103 8.5 5.506 5.506 0 008.5 14z"
            />
          </svg>
        </button>
      </div>
      
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
          <button
          onClick={() => {
            setIsEditMode(false);
            handleShow();
          }}
          className="flex flex-row items-center ml-6 justify-center w-full px-4 py-4 mb-4 text-sm font-bold bg-green-300 leading-6 capitalize duration-100 transform rounded-sm shadow cursor-pointer focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none sm:mb-0 sm:w-auto sm:mr-4 md:pl-8 md:pr-6 xl:pl-12 xl:pr-10 hover:shadow-lg hover:-translate-y-1"
        >
          Create new Album
        </button>
        <div>
           <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditMode ? "Edit User" : "Add New User"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>            
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  User Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.name}
                  id="name"
                  onChange={handleChange}
                />
              </div>
      
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
               User Phone
                </label>
                <input
                type="text"
                  className="form-control"
                  id="phone"
                  value={newUser.phone}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="mb-3">
                <label htmlFor="website" className="form-label">
                 User Website
                </label>
                <input
                type="text"
                  className="form-control"
                  id="website"
                  value={newUser.website}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                User Address
                </label>
                <textarea
                  className="form-control"
                  id="address"
                  value={newUser.address}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="company" className="form-label">
                  User Company
                </label>
                <input
                type="text"
                  className="form-control"
                  id="company"
                  value={newUser.company}
                  onChange={handleChange}
                ></input>
              </div>
              <Button variant="primary" type="submit">
                {isEditMode ? "Update" : "Submit"}
              </Button>
            </form>
          </Modal.Body>
        </Modal>
        </div>
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    User Id
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    User name
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((users) => (
                    <tr key={users.id} className="bg-gray-100 border-b">
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {users.id}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {users.name}
                      </td>
                      <td className="text-sm font-bold text-gray-900 hover:text-green-300 whitespace-nowrap">
                        <button onClick={() => handleEdit(users)}>Edit</button>
                      </td>
                      <td className="text-sm font-bold text-gray-900 hover:text-slate-400 px-6 py-2 whitespace-nowrap">
                        <button onClick={() => handleUser(users.id)}>
                          View Detail
                        </button>
                      </td>
                      <td className="text-sm font-bold text-gray-900  hover:text-red-600 whitespace-nowrap">
                        <button onClick={() => handleDelete(users.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="text-sm text-gray-900 px-6 py-4 text-center"
                    >
                      Nothing found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListUser;
