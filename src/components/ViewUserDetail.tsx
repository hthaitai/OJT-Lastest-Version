import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createData, deleteData, fetchData, updateData } from "../service/Api";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
import { toast, ToastContainer } from "react-toastify";

interface UserDetail {
  name: string;
  email: string;
  phone: number;
  website: string;
  address: Address;
  company: Company;
}
interface Address {
  city: string;
  zipcode: number;
  street: string;
  suite: string;
}
interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
interface Tasks {
  id: number;
  title: string;
  completed: boolean;
}
interface Posts {
  id: number;
  title: string;
  body: string;
}

function ViewUserDetail() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [posts, setPosts] = useState<Posts[]>([]);
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'tasks'>('posts'); // State to toggle tabs
  const [isEditMode, setIsEditMode] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [editingPostId, setEditingPostId] = useState<number | null>(null); // Track the post being edited

  const [newPosts, setNewPosts] = useState({
    id: 0,
    title: "",
    body: "",
  });

  useEffect(() => {
    getUserDetail();
    getPosts();
    getTasks();
  }, [id]);

  const getUserDetail = async () => {
    try {
      const response = await fetchData(`/users/${id}`);
      if (response.error) {
        setError(response.error);
      } else {
        setUserDetail(response);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const getPosts = async () => {
    try {
      const response = await fetchData(`/users/${id}/posts`);
      if (response.error) {
        setError(response.error);
      } else {
        setPosts(response);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const getTasks = async () => {
    try {
      const response = await fetchData(`/users/${id}/todos`);
      if (response.error) {
        setError(response.error);
      } else {
        setTasks(response);
        console.log(response);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!userDetail) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditMode && editingPostId !== null) {
      // Update mode
      const endpoint = `/albums/${editingPostId}`;
      const response = await updateData(endpoint, newPosts);

      if ("error" in response) {
        console.error("Error updating post", response.error);
        setError(response.error);
      } else {
        setPosts(
          posts.map((post) =>
            post.id === editingPostId ? { ...post, ...newPosts } : post
          )
        );
        setShow(false);
        toast.success("Post updated successfully!");
      }
    } else {
      // Create mode
      const endpoint = "/posts";
      const response = await createData(endpoint, newPosts);

      if ("error" in response) {
        console.error("Error creating post", response.error);
        setError(response.error);
      } else {
        const createPost = { ...newPosts, id: Date.now() };
        setPosts([createPost, ...posts]);
        setShow(false);
        toast.success("Post created successfully!");
      }
    }

    setIsEditMode(false); // Reset the edit mode
    setEditingPostId(null); // Reset the post being edited

  };
  const handleDelete = async (postId: number) => {
    const response = await deleteData(`/users/posts?id=${postId}`);
    if ("error" in response) {
      console.error("Error deleting post", response.error);
      setError(response.error);
    } else {
      setPosts(posts.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully!");
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPosts({
      ...newPosts,
      [e.target.id]: e.target.value,
    });
  };
  return (
    <div>
      <ToastContainer/>
      <div className="max-w-xs mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-24">
        <div className="bg-gray-100 px-4 py-2">
          <h2 className="text-lg font-medium text-gray-800">User ID: {id}</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Name</span>
            <span className="text-lg font-medium text-gray-800">{userDetail.name}</span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Email</span>
            <span className="text-lg font-medium text-gray-800">{userDetail.email}</span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Phone</span>
            <span className="text-lg font-medium text-gray-800">{userDetail.phone}</span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Address</span>
            <span className="text-lg font-medium text-gray-800">
              {userDetail.address.street} - {userDetail.address.suite} - {userDetail.address.city} - {userDetail.address.zipcode}
            </span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Website</span>
            <span className="text-lg font-medium text-gray-800">{userDetail.website}</span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Company Name</span>
            <span className="text-lg font-medium text-gray-800">{userDetail.company.name}</span>
            <span className="text-sm font-medium text-gray-600">Catch Phrase</span>
            <span className="text-lg font-medium text-gray-800">{userDetail.company.catchPhrase}</span>
            <span className="text-sm font-medium text-gray-600">Bs</span>
            <span className="text-lg font-medium text-gray-800">{userDetail.company.bs}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a href="/album#/album" className="relative">
              <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-gray-700"></span>
              <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-black px-3 py-1 text-base font-bold text-white transition duration-100 hover:bg-gray-900 hover:text-yellow-500">
                Back
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="my-6 mx-4 flex justify-center">
        <button
          className={`px-4 py-2 mx-2 font-bold text-white rounded-lg ${activeTab === 'posts' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-blue-600'}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={`px-4 py-2 mx-2 font-bold text-white rounded-lg ${activeTab === 'tasks' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-blue-600'}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
      </div>

      {/* Conditional rendering based on selected tab */}
      {activeTab === 'posts' ? (
        <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
          <button
            className={`px-4 py-2 mx-2 font-bold rounded-lg ${activeTab === 'posts' ? 'bg-green-400' : 'bg-gray-600 hover:bg-blue-600'}`}
            onClick={() => {
              setIsEditMode(false);
              handleShow();
            }}
          >
            Add New Post
          </button>
          <div>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? "Edit Post" : "Add new post"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Post Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={newPosts.title}
                      id="title"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="body" className="form-label">
                      Post Content
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={newPosts.body}
                      id="body"
                      onChange={handleChange}
                    />
                  </div>
                  <Button variant="primary" type="submit">
                    {isEditMode ? "Update" : "Submit"}
                  </Button>
                </form>
              </Modal.Body>
            </Modal>
          </div>
          <table className="w-4/5- table-fixed">
            <thead>

              <tr className="bg-gray-100">

                <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Post Title</th>

                <th className="w-3/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Content</th>
                <th className="w-3/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {posts.length === 0 ? (
                <tr>
                  <td className="py-4 px-6 border-b border-gray-200" colSpan={2}>
                    No posts yet.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} >
                    <td className="py-4 px-6 border-b border-gray-200">{post.title}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{post.body}</td>
                    <td className="text-sm font-bold text-gray-900 whitespace-nowrap flex space-x-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                          setIsEditMode(true);
                          setEditingPostId(post.id);
                          setNewPosts({ title: post.title, body: post.body, id: post.id });
                          handleShow();
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDelete(post.id)}                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Task Title</th>
                <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Completed Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {tasks.length === 0 ? (
                <tr>
                  <td className="py-4 px-6 border-b border-gray-200" colSpan={2}>
                    No tasks yet.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="py-4 px-6 border-b border-gray-200">{task.title}</td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <span
                        className={`py-1 px-2 rounded-full text-xs text-white ${task.completed ? "bg-green-500" : "bg-red-500"
                          }`}
                      >
                        {task.completed ? "Completed" : "Incomplete"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewUserDetail;
