import Head from 'next/head'
import Link from 'next/link';
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'


export default function Home() {
  const [searchString, setSearchString] = useState('');
  const router = useRouter();

  function handleChange(e){
    setSearchString(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    router.push("/books/search-results")
  }


  return (
    <div className="container-md mx-auto px-4">
      <Head>
        <title>Search Gutendex | A. Kotsampaseris</title>
        <meta name="description" content="NextJS app using Gutendex API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-full mx-auto p-5">
        <div className="w-8/12 flex flex-col justify-items-center">
          <h1 className="text-2xl text-center">
            <Link href="/">Search GutendexAPI</Link>
          </h1>
          <form className="w-full pt-4 flex gap-2" onSubmit={handleSubmit}>
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
      </main>
    </div>
  )
}