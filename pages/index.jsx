import Head from 'next/head'
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [books, setBooks] = useState([]);

  async function fetchData(){
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?title=${searchString}`)
      const json = await res.json();
      setBooks(json);
      setLoading(false);
    } catch(e) {
      console.log(e)
    }
  }

  function handleChange(e){
    setSearchString(e.target.value);
  }

  const handleSubmit = e => {
    setLoading(false);
    e.preventDefault();
    setLoading(true);
    fetchData();
  }


  return (
    <div className="mx-auto">
      <Head>
        <title>Search Results | GutendexAPI</title>
        <meta name="description" content="NextJS app using GutendexAPI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="md:flex-col lg:grid grid-cols-5 border-b-2 border-indigo-500 w-full p-6">
        <div>
          <h1 className="text-2xl text-indigo-500">
            <Link href="/">Search GutendexAPI</Link>
          </h1>
        </div>
        <div className="col-span-4">
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <input
              placeholder='Moby Dick, Frankenstein etc'
              type='text'
              className='mt-1 block w-9/12 px-3 py-2 bg-white border border-slate-300 rounded-md text-black text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
              value={searchString}
              onChange={handleChange}
            />
            <button type="submit" className="w-3/12 rounded bg-indigo-400 hover:bg-indigo-600">
                Search
            </button>
          </form>
        </div>
      </div>
      <main className="mx-auto py-4 lg:px-2 md:px-0 w-8/12">
        <BookList books={books} loading={loading} />
      </main>
    </div>
  )
}

function BookList({books, loading}){
  if (loading) return (
    <p className="text-small text-center text-indigo-500">Results loading...</p>
  )

  if (!loading && !books.length) return (
    <p className="text-small text-center text-indigo-500">Search for a book you love.</p>
  )

  return (
    <div>
      {books?.map(book => (
        <div className="my-2 py-2 border-b border-indigo-500" key={book.id}>
          <div className="text-xl text-indigo-500">
            <Link href={{pathname: `/books/book/${book.id}`}}>
              {book.title}
            </Link>
          </div>
          <div className="md:flex-col lg:flex py-1">
            <ul className="list-none">
            {book.authors?.map(author => {
              return (<li className="md:text-sm text-indigo-200" key={author.name}>{author.name}</li>)
            })}
            </ul>
          </div>
          <div className="text-xs text-indigo-300">Downloads: {book.download_count}</div>
        </div>
        )
      )}
    </div>
  )
}