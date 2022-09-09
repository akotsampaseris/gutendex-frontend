import Head from 'next/head'
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SearchResults() {
  const [searchString, setSearchString] = useState('');
  const [books, setBooks] = useState([]);

  async function fetchData(){
    try{
      const res = await fetch(`https://localhost:8000/books/search?title=${searchString}`)
      const json = await res.json()
      setBooks(json)
    } catch(e) {
      console.log(e)
    }
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
        <title>GutendexAPI | A. Kotsampaseris</title>
        <meta name="description" content="NextJS app using GutendexAPI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full mt-2 m-0">
        <div className="grid grid-cols-3 gap-4 border-b-2 border-indigo-500 w-full p-4">
          <div className="p-0 m-0">
            <h1 className="text-2xl p-0 m-0">
              <Link href="/">Search GutendexAPI</Link>
            </h1>
          </div>
          <div className="col-span-2 p-0 m-0">
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                placeholder='eg Frankenstein'
                type='text'
                className='mt-1 block w-9/12 px-3 py-2 bg-white border border-slate-300 rounded-md text-black text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                value={searchString}
                onChange={handleChange}
              />
              <button type="submit" className="w-3/12 rounded bg-sky-500 hover:bg-sky-700">
                  Search
              </button>
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
    <div className="m-4 w-8/12 mx-auto">
      <p className="text-2xl text-center">Results</p>
      {books.map(book => (
        <div className="m-4 p-4 border border-indigo-500 rounded" key={book.id}>
          <div className="text-xl text-indigo-500">
            <Link href={{pathname: `/books/book/${book.id}`}}>{book.title}</Link>
          </div>
          <div className="">
            <span>Author(s): </span>
            {book.authors.map(author => {
              <span>{author.name}</span>
            })} 
          </div>
          <div className="text-xs text-indigo-500">Downloads: {book.download_count}</div>
        </div>
        )
      )}
    </div>
  )
}