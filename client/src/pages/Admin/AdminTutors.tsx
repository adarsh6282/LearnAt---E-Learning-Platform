import {useState,useEffect} from 'react'
import axiosInstance from '../../services/apiService'
import BeatLoader from "react-spinners/BeatLoader"
import { useNavigate } from 'react-router-dom'

interface Tutor{
  name:string,
    email:string,
    username:string,
    password:string,
    phone:string,
    title:string,
    yearsOfExperience:number,
    role:"user"|"admin"|"instructor"
    education:string,
    accountStatus:"pending"|"blocked"|"active",
    isVerified:boolean,
}

const AdminTutors = () => {
  const [loading,setLoading]=useState(true)
  const navigate=useNavigate()
  const[tutors,setTutors]=useState<Tutor[]>([])

  useEffect(()=>{
    const fetchTutors=async()=>{
      try{
      const res = await axiosInstance.get<Tutor[]>("/admin/tutors")
      const verifiedTutors = res.data.filter(tutor => tutor.isVerified === true)
      setTutors(verifiedTutors)
      }catch(err){
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
    setTimeout(() => {
      fetchTutors()
    },1500);
  },[])

  return (
    !loading?
    (<div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered Tutors</h2>

        <button
          onClick={() => navigate("/admin/tutor-requests")}
          className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          New Requests
        </button>
        
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
              {tutors.map(tutor => (
                <tr key={tutor.email} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{tutor.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tutor.email}</td>
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

export default AdminTutors
