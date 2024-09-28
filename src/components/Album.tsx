import React, { ChangeEvent, useEffect, useState } from "react";
import { createData, deleteData, fetchData, updateData } from "../service/Api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
interface AlbumType {
  id: number;
  userId: number;
  title: string;
}
function Album() {
  const [album, setAlbum] = useState<AlbumType[]>([]);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [show, setShow] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track whether editing or creating
  const [editingAlbumId, setEditingAlbumId] = useState<number | null>(null); // Track the post being edited
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const getAlbum = async (): Promise<void> => {
    const response = await fetchData("/albums");
    if (response.error) {
      setError(response.error);
    } else {
      setAlbum(response);
    }
  };
  const [newAlbum, setNewAlbum] = useState({
    id: 0,
    userId: 0,
    title: "",
  });

  const handleAlbum = (albumId: number) => {
    navigate(`/viewalbumdetail/${albumId}`, { state: { albumId } });
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const searchAlbum = async () => {
    if (searchInput === "") {
      getAlbum();
    } else {
      try {
        const response = await fetchData(`/album/${searchInput}`);
        if (response.error) {
          setError(response.error);
        } else {
          setAlbum(response);
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
  };
  
  useEffect(() => {
    getAlbum();
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditMode && editingAlbumId !== null) {
      // Update mode
      const endpoint = `/albums/${editingAlbumId}`;
      const response = await updateData(endpoint, newAlbum);

      if ("error" in response) {
        console.error("Error updating post", response.error);
        setError(response.error);
      } else {
        setAlbum(
          album.map((album) =>
            album.id === editingAlbumId ? { ...album, ...newAlbum } : album
          )
        );
        setShow(false);
        toast.success("Post updated successfully!");
      }
    } else {
      // Create mode
      const endpoint = "/posts";
      const response = await createData(endpoint, newAlbum);

      if ("error" in response) {
        console.error("Error creating post", response.error);
        setError(response.error);
      } else {
        const createdAlbum = {  ...newAlbum, id: Date.now() };
        setAlbum([createdAlbum, ...album]);
        setShow(false);
        toast.success("Post created successfully!");
      }
    }

    setIsEditMode(false); // Reset the edit mode
    setEditingAlbumId(null); // Reset the post being edited
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewAlbum({
      ...newAlbum,
      [e.target.id]: e.target.value,
    });
  };
  
  const handleDelete = async (albumId: number) => {
    const response = await deleteData(`/albums/${albumId}`);
    if ("error" in response) {
      console.error("Error deleting post", response.error);
      setError(response.error);
    } else {
      setAlbum(album.filter((album) => album.id !== albumId));
      toast.success("Post deleted successfully!");
    }
  };
  const handleEdit = (album: AlbumType) => {
    setIsEditMode(true);
    setEditingAlbumId(album.id);
    setNewAlbum({
      id: album.id,
      userId: newAlbum.userId,
      title: album.title,
    });
    handleShow();
  };

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
          onClick={searchAlbum}
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
      <button
          onClick={() => {
            setIsEditMode(false); // Ensure we're in create mode
            handleShow();
          }}
          className="flex flex-row items-center justify-center w-full px-4 py-4 mb-4 text-sm font-bold bg-green-300 leading-6 capitalize duration-100 transform rounded-sm shadow cursor-pointer focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none sm:mb-0 sm:w-auto sm:mr-4 md:pl-8 md:pr-6 xl:pl-12 xl:pr-10 hover:shadow-lg hover:-translate-y-1"
        >
          Create new Post
        </button>
        <div>
           <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditMode ? "Edit Post" : "Add new post"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="id" className="form-label">
                  Album ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={newAlbum.id}
                  id="id"
                  onChange={handleChange}
                  disabled={isEditMode} // Disable editing the user ID in edit mode
                />
              </div>
            
              <div className="mb-3">
                <label htmlFor="userId" className="form-label">
                  Album User ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={newAlbum.userId}
                  id="userId"
                  onChange={handleChange}
                />
              </div>
      
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Album title
                </label>
                <textarea
                  className="form-control"
                  id="title"
                  value={newAlbum.title}
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
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Album ID
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Album Title
                  </th>
                </tr>
              </thead>
              <tbody>
                {album.length > 0 ? (
                  album.map((albums: AlbumType) => (
                    <tr key={albums.id} className="bg-gray-100 border-b">
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {albums.id}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {albums.title}
                      </td>
                      <td className="text-sm font-bold text-gray-900 hover:text-slate-400 px-6 py-2 whitespace-nowrap">
                        <button onClick={() => handleAlbum(albums.id)}>
                          View Detail
                        </button>
                      </td>
                      <td className="text-sm font-bold text-gray-900 hover:text-green-300 whitespace-nowrap">
                        <button onClick={() => handleEdit(albums)}>Edit</button>
                      </td>
                      <td className="text-sm font-bold text-gray-900  hover:text-red-600 whitespace-nowrap">
                        <button onClick={() => handleDelete(albums.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
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

export default Album;
