import React from 'react'

const SignUp = () => {
  return (
    <main>
      <div className="flex h-screen">

        {/* Left Section */}
        <div className="flex flex-1 relative">
          <div className="absolute inset-0 flex items-center justify-center bg-red-200">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-center font-bold text-xl mb-4 text-gray-800">SIGN UP</h2>
              <form className="text-gray-700">
                <input
                  type="text"
                  placeholder="Username"
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Email"
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center justify-center flex-1 bg-white">
          <h1 className="font-bold text-xl mb-2">Surge SE Internship</h1>
          <p className="text-gray-500 mb-4">January 2025</p>
          <p className="font-bold italic">Emith Dinsara</p>
        </div>
      </div>

    </main>
  )
}

export default SignUp