import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';

export default function Book() {
  const [book, setBook] = useState('');
  const router = useRouter();
  const { bookID } = router.query;

  useEffect(() => {
    async function fetchBook() {
      const res = await fetch(`http://localhost:8000/books/book/${bookID}`);
      const json = await res.json();
      setBook(json);
    }
    fetchBook();
  }, [])


  return (
    <div className="container">
      <Head>
        <title>{book.title} | {book.author}</title>
        <meta name="description" content="NextJS app using Gutendex API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <h2 className="">{book.title}</h2>
        <Link href="/">Go back</Link>
      </main>
    </div>
  )
}

