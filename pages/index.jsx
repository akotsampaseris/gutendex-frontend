import Head from 'next/head'
import Link from 'next/link';
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react';

export default function SearchBookTitle() {
  const [searchString, setSearchString] = useState('');
  const [books, setBooks] = useState([]);

  async function fetchData(){
    const res = await fetch(`http://localhost:8000/books/search?title=${searchString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const json = await res.json()
    setBooks(json)
  }

  function handleChange(e){
    setSearchString(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    fetchData();
  }


  return (
    <div className="container-md mx-auto px-4">
      <Head>
        <title>Search Gutendex | A. Kotsampaseris</title>
        <meta name="description" content="NextJS app using Gutendex API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main mx-auto p-5">
        <div className="grid grid-cols-3 inline-block align-baseline border-b-2 border-indigo-500 w-full p-4">
          <div className="w-full">
            <h1 className={styles.title}>Search Gutendex</h1>
          </div>
          <div>
            <form className="w-full" onSubmit={handleSubmit}>
              <input
                placeholder='eg Frankenstein'
                type='text'
                className='mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-black text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                value={searchString}
                onChange={handleChange}
              />
            </form>
          </div>
        </div>
        <BookList books={books}></BookList>
      </main>
    </div>
  )
}

function BookList({books}){
  return (
    <div className="overflow-x-auto">
        <div className="min-w-screen min-h-screen flex items-center justify-center font-sans overflow-hidden">
            <div className="w-full lg:w-5/6">
              <div><h1 className="text-2xl">Results</h1></div>
                <div className="bg-white shadow-md rounded my-6">
                    <table className="min-w-full leading-normal table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-center">Title</th>
                                <th className="py-3 px-6 text-center">Author(s)</th>
                                <th className="py-3 px-6 text-center">Downloads</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                          {books.map(book => (
                            <tr className="border-b border-gray-200 hover:bg-gray-100" key={book.id}>
                              <td className="py-3 px-6 text-center whitespace-nowrap">
                                <Link href={{pathname: `/books/book/${book.id}`}}>{book.title}</Link>
                              </td>
                              <td className="table-cell text-center">{book.title}</td>
                              <td className="table-cell text-center">{book.download_count}</td>
                            </tr>
                            )
                          )}
                        </tbody>
                      </table>
                  </div>
              </div>
          </div>
    </div>
  )
}