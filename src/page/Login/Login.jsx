import { React } from 'react'

export const Login = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-gray-100'>
      <div
        className='bg-white w-96 h-96 rounded-lg shadow-lg p-8 flex flex-col items-center justify-center'
      >
        <h1 className='text-2xl font-bold mb-4'>Login</h1>
        <form className='flex flex-col items-center justify-center space-y-4'>
          <input
            type='text'
            className='w-full p-2 border border-gray-300 rounded-md'
            placeholder='Username'
          />
          <input
            type='password'
            className='w-full p-2 border border-gray-300 rounded-md'
            placeholder='Password'
          />
          <button
            type='submit'
            className='w-full p-2 bg-blue-500 text-white rounded-md'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}