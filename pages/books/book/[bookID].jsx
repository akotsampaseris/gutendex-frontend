import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';

export default function BookView() {
  const router = useRouter();
  const { bookID } = router.query;

  const [book, setBook] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBook() {
      const res = await fetch(`http://localhost:8000/books/book/${bookID}`);
      const json = await res.json();
      setBook(json);
    }
    fetchBook();
    setLoading(false);
  })


  return (
    <div className="container">
      <Head>
        <title>{book.title} | GutendexAPI</title>
        <meta name="description" content="NextJS app using Gutendex API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <div className="grid grid-cols-5 gap-2 border-b-2 border-indigo-500 w-full p-4">
          <div>
            <h1 className="text-2xl text-indigo-500">
              <Link href="/">Search GutendexAPI</Link>
            </h1>
          </div>
        </div>
        <div className="w-8/12 mx-auto m-4 p-10 border border-indigo-500 rounded">
          <BookDetails book={book} loading={loading} />
        </div>
      </main>
    </div>
  )
}

function BookDetails({book, loading}){
  if (loading || !book.authors) return (
    <p className="text-small text-center text-indigo-500">Loading...</p>
  )
  
  
  return (
    <div>
      <div className="flex justify-between gap-4">
        <Link href={{pathname: `/books/book/${book.id}`}}>
          <span className="text-xl text-indigo-500">{book.title}</span>
        </Link>
        <div className="flex-col">
          <p className="text-lg text-blue-500">Rating: 5/5</p>
          <p className="text-xs text-blue-300 text-center">
            <Link href="/">View all ratings</Link>
          </p>
        </div>
      </div>
      <div className="flex">
        <span className="text-md">Author(s): </span> 
        <ul className="list-none">
        {book.authors.map(author => {
          return (<li className="pl-2" key={author.name}>{author.name}</li>)
        })}
        </ul>
      </div>
      <div className="text-xs text-indigo-500 pt-1">
        <span>Languages: {book.languages}</span> 
        <span> | </span> 
        <span>Downloads: {book.download_count}</span>
      </div>
      <PostBookReview book={book} />
    </div>
  )
}

function PostBookReview({book}){
  return (
    <div className="mt-5 pt-5">
      <p className="text-xl text-blue-400">Your review for "{book.title}".</p>
      <form className="pt-3">
        <label className="block flex pb-2">
          <span>Rating: </span>
          <select className="rounded bg-white text-black ml-2">       
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </label>
        <textarea className="
          form-control
          block
          w-full
          pt-4
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        " placeholder="Write your review here..." id="review" name="review" rows="4" cols="50" />
        <button className="mt-2 py-2 px-4 rounded bg-indigo-400 hover:bg-indigo-600">
          Post your review
        </button>
      </form>
    </div>
  )
}