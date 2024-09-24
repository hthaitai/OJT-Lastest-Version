import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../service/Api";
interface AlbumDetail{
  userId: number;
  title: String;
}
interface Photos{
  id: number;
  url: string;
}
function ViewAlbumDetail() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [albumDetail, setAlbumDetail] = useState<AlbumDetail | null>(null);
  const [photos, setPhotos] = useState<Photos []> ([]);

  useEffect(() => {
    getAlbumDetail();
    getPhotos();
  }, [id]);

  const getAlbumDetail = async () => {
    try {
      const response = await fetchData(`/albums/${id}`);
      if (response.error) {
        setError(response.error);
      } else {
        setAlbumDetail(response);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const getPhotos = async () => {
    try {
      const response = await fetchData(`/albums/${id}/photos`);
      if (response.error) {
        setError(response.error);
      } else {
        setPhotos(response);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!albumDetail) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="max-w-xs mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-24">
        <div className="bg-gray-100 px-4 py-2">
          <h2 className="text-lg font-medium text-gray-800">Album : {id}</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">User ID</span>
            <span className="text-lg font-medium text-gray-800">
              {albumDetail.userId}
            </span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Title</span>
            <span className="text-lg font-medium text-gray-800">
              {albumDetail.title}
            </span>
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
      <div className="w-full bg-white rounded-lg border p-2 my-4 mx-6">
        <h3 className="font-bold">Photos</h3>
      </div>

      {photos.length === 0 ? (
        <p>No photos yet.</p>
      ) : (
        <div className="flex flex-wrap">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white flex-shrink-0 flex flex-col rounded-md shadow-md overflow-hidden p-4 m-2 max-w-xs"
            >
              <img
                className="w-full h-auto"
                src={photo.url}
                alt="Info card image"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewAlbumDetail;
