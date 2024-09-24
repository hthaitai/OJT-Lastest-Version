import React, { ChangeEvent, useEffect, useState } from "react";
import { fetchData } from "../service/Api";
import { useNavigate } from "react-router-dom";
interface AlbumType {
  id: number;
  title: string;
}
function Album() {
  const [album, setAlbum] = useState([]);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const getAlbum = async (): Promise<void> => {
    const response = await fetchData("/albums");
    if (response.error) {
      setError(response.error);
    } else {
      setAlbum(response);
    }
  };
  

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
  return (
    <div className="flex flex-col">
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
