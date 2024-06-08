/**
 * Componente que se encarga de ser un selector para que el usuario escoja con qué tipo de usuario logearse.
 *
 * @returns {JSX.Element} El componente SwitchUser.
 */
import { React, useEffect, useState } from 'react'
import { User } from './User'

export const SwitchUser = () => {
  const [ listUser, setListUser ] = useState([])

  // useEffect(() => {
  //   window.api.receive('get-all-users-response', (users) => {
  //     setListUser(users)
  //   })
  //   window.api.send('get-all-users')
  // }, [])
  // console.log(listUser)
  return (
    <div className='w-screen h-screen flex bg-gray-100 gap-2 p-6'>
       <User />
    </div>
  )
}