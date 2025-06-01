import {useState,useEffect} from 'react'
import axiosInstance from '../../services/apiService'
import BeatLoader from "react-spinners/BeatLoader"

interface User{
  name:string,
  username:string,
  email:string,
  password:string,
  googleId:string
  phone:string,
  role:"admin"|"user"|"instructor",
  createdAt:Date,
  updatedAt:Date
}

const AdminUsers = () => {
  const [loading,setLoading]=useState(true)
  const[users,setUsers]=useState<User[]>([])

  useEffect(()=>{
    const fetchUsers=async()=>{
      try{
        await axiosInstance.get<User[]>("/admin/users").then((res)=>setUsers(res.data))
      }catch(err){
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
    setTimeout(() => {
      fetchUsers()
    },1500);
  },[])

  return (
    !loading?
    (<div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered Users</h2>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.email} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ):(
    <div className="flex justify-center items-center h-180">
      <BeatLoader color="#7e22ce" size={30} />
    </div>
  )
  )
}

export default AdminUsers

