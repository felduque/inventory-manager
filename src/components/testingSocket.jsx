import React, { useEffect, useState } from 'react'
// sqlite3 
import sqlite3 from 'sqlite3'
export const TestingSocket = () => {
  const [ data, setData ] = useState([])
  
  /**
   * MODELO
   * CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
   */
  // Crear una nueva base de datos SQLite.

  useEffect(() => {
    const getDatabase = () => {
      let db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        db.all(`SELECT * FROM users`, (err, rows) => {
          if (err) {
            console.error(err.message);
          }
          setData(rows)
        })
      });
    }
    getDatabase()
  }, [])

  const saveUser = () => {
    let db = new sqlite3.Database('./database.db', (err) => {
      if (err) {
        console.error(err.message);
      }
      db.run(`INSERT INTO users (name, email, password) VALUES ('Felipe', 'felduque@gmail.com', '123456')`, (err) => {
        if (err) {
          console.error(err.message);
        }
      })
    });
  }
  return (
    <div className='bg-red-200 w-full h-full'>
      <h1>Testing Socket</h1>
      <button onClick={saveUser}>Save User</button>
      <div>
        <h1>Users</h1>
        <ul>
          {
            data.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}
