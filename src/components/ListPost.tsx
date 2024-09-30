import React, { useEffect, useState } from "react";
import { createData, deleteData, fetchData, updateData } from "../service/Api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";

interface Post {
  id: number;
  title: string;
}

function ListPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track whether editing or creating
  const [editingPostId, setEditingPostId] = useState<number | null>(null); // Track the post being edited
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [newPost, setNewPost] = useState({
    userId: "",
    title: "",
    body: "",
  });

  const navigate = useNavigate();

  const getPost = async () => {
    setLoading(true);
    const response = await fetchData<Post[]>("/posts");
    setLoading(false);

    if ("error" in response) {
      setError(response.error);
    } else {
      setPosts(response);
    }
  };

  const handlePost = (postid: number) => {
    navigate(`/viewpostdetail/${postid}`, { state: { postid } });
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const searchPost = async () => {
    if (searchInput === "") {
      getPost();
    } else {
      setLoading(true);
      const response = await fetchData<Post[]>(`/posts?title=${searchInput}`);
      setLoading(false);

      if ("error" in response) {
        setError(response.error);
      } else {
        setPosts(response);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPost({
      ...newPost,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditMode && editingPostId !== null) {
      // Update mode
      const endpoint = `/posts/${editingPostId}`;
      const response = await updateData(endpoint, newPost);

      if ("error" in response) {
        console.error("Error updating post", response.error);
        setError(response.error);
      } else {
        setPosts(
          posts.map((post) =>
            post.id === editingPostId ? { ...post, ...newPost } : post
          )
        );
        setShow(false);
        toast.success("Post updated successfully!");
      }
    } else {
      // Create mode
      const endpoint = "/posts";
      const response = await createData(endpoint, newPost);

      if ("error" in response) {
        console.error("Error creating post", response.error);
        setError(response.error);
      } else {
        const createdPost = { id: Date.now(), ...newPost };
        setPosts([createdPost, ...posts]);
        setShow(false);
        toast.success("Post created successfully!");
      }
    }

    setIsEditMode(false); // Reset the edit mode
    setEditingPostId(null); // Reset the post being edited
  };

  const handleDelete = async (postid: number) => {
    const response = await deleteData(`/posts/${postid}`);
    if ("error" in response) {
      console.error("Error deleting post", response.error);
      setError(response.error);
    } else {
      setPosts(posts.filter((post) => post.id !== postid));
      toast.success("Post deleted successfully!");
    }
  };

  const handleEdit = (post: Post) => {
    setIsEditMode(true);
    setEditingPostId(post.id);
    setNewPost({
      userId: String(post.id),
      title: post.title,
      body: "",
    });
    handleShow();
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="flex flex-col">
      <ToastContainer />
      <div className="relative max-w-sm mx-auto mt-20">
        <input
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          placeholder="Search"
        />
        <button
          onClick={searchPost}
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

      <div className="flex flex-col w-full sm:w-auto sm:flex-row p-4">
        <button
          onClick={() => {
            setIsEditMode(false); // Ensure we're in create mode
            handleShow();
          }}
          className="flex flex-row items-center pl-2 justify-center w-full px-4 py-4 mb-4 text-sm font-bold bg-green-300 leading-6 capitalize duration-100 transform rounded-sm shadow cursor-pointer focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none sm:mb-0 sm:w-auto sm:mr-4 md:pl-8 md:pr-6 xl:pl-12 xl:pr-10 hover:shadow-lg hover:-translate-y-1"
        >
          Create new Post
        </button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditMode ? "Edit Post" : "Add new post"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="userId" className="form-label">
                  Post User ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={newPost.userId}
                  id="userId"
                  onChange={handleChange}
                  disabled={isEditMode} // Disable editing the user ID in edit mode
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Post Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={newPost.title}
                  id="title"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="body" className="form-label">
                  Post Body
                </label>
                <textarea
                  className="form-control"
                  id="body"
                  value={newPost.body}
                  onChange={handleChange}
                ></textarea>
              </div>
              <Button variant="primary" type="submit">
                {isEditMode ? "Update" : "Submit"}
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Post Id
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Post Title
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                    Actions
                  </th>
                
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.id} className="bg-gray-100 border-b">
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {post.id}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {post.title}
                      </td>
                      <td className="text-sm font-bold text-gray-900 hover:text-slate-400 whitespace-nowrap">
                        <button onClick={() => handlePost(post.id)}>View Detail</button>
                      </td>
                      <td className="text-sm font-bold text-gray-900 hover:text-green-300 whitespace-nowrap">
                        <button onClick={() => handleEdit(post)}>Edit</button>
                      </td>
                      <td className="text-sm font-bold text-gray-900  hover:text-red-600 whitespace-nowrap">
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-sm text-gray-900 px-6 py-4 text-center">
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

export default ListPost;
