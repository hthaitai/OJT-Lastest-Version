import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../service/Api";
interface UserDetail{
  name: string ;
  email: string;
  phone: number;
  website: string;
  address: Address;
  company:Company;
}
interface Address{
  city: string;
  zipcode: number;
  street: string;
  suite: string;
}
interface Company{
  name: string;
  catchPhrase: string;
  bs: string;
}
interface Tasks{
id: number;
title: string;
completed: boolean;
}
interface Posts{
  id:number; 
  title: string;
  body: string;

}
function ViewUserDetail() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail |null>(null);
  const [posts, setPosts] = useState<Posts []>([]);
  const [tasks, setTasks] = useState<Tasks []>([]);

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
        console.log(response)
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

  return (
    <div>
      <div className="max-w-xs mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-24">
        <div className="bg-gray-100 px-4 py-2">
          <h2 className="text-lg font-medium text-gray-800">User ID: {id}</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">name</span>
            <span className="text-lg font-medium text-gray-800">
              {userDetail.name}
            </span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Email</span>
            <span className="text-lg font-medium text-gray-800">
              {userDetail.email}
            </span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Phone</span>
            <span className="text-lg font-medium text-gray-800">
              {userDetail.phone}
            </span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Address</span>
            <span className="text-lg font-medium text-gray-800">
              {userDetail.address.street} -   {userDetail.address.suite} -    {userDetail.address.city} -    {userDetail.address.zipcode} 
            </span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Website</span>
            <span className="text-lg font-medium text-gray-800">
              {userDetail.website}
            </span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Company Name</span>
            <span className="text-lg font-medium text-gray-800">
              {userDetail.company.name}
            </span>
            <span className="text-sm font-medium text-gray-600">Catch Phrase</span>
            <span className="text-lg font-medium text-gray-800">
              {userDetail.company.catchPhrase}
            </span>
            <span className="text-sm font-medium text-gray-600">Bs</span>
            <span className="text-lg font-medium text-gray-800">
              {userDetail.company.bs}
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/user" className="relative">
              <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-gray-700"></span>
              <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-black px-3 py-1 text-base font-bold text-white transition duration-100 hover:bg-gray-900 hover:text-yellow-500">
                Back
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-lg border p-2 my-4 mx-6">
        <h3 className="font-bold">Posts</h3>
        {posts.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
            posts.map((post) => (
            <div key={post.id} className="border rounded-md p-3 ml-3 my-3">
              <div className="flex gap-3 items-center">
                
                <h3 className="font-bold">{post.title}</h3>
              </div>
              <p className="text-gray-600 mt-2">{post.body}.</p>
            </div>
          ))
        )}
      </div>
      <div className="w-full bg-white rounded-lg border p-2 my-4 mx-6">
        <h3 className="font-bold">Tasks</h3>
        {tasks.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
            tasks.map((task) => (
            <div key={task.id} className="border rounded-md p-3 ml-3 my-3">
              <div className="flex gap-3 items-center">
                
                <h3 className="font-bold">{task.title}</h3>
              </div>
              <p className="text-gray-600 mt-2">Completed Status: {task.completed.toString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewUserDetail;
