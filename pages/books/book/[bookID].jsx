import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';

export default function BookView() {
  const router = useRouter();
  const { bookID } = router.query;

  const [book, setBook] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBook() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${bookID}`);
      const json = await res.json();
      
      setBook(json);
    }
    
    fetchBook();
    console.log(book.reviews)
    setLoading(false);
  }, [])


  return (
    <div className="container">
    <Head>
        <title>{book.title} | GutendexAPI</title>
        <meta name="description" content="NextJS app using Gutendex API" />
        <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="grid grid-cols-5 gap-2 border-b-2 border-indigo-500 w-full p-4">
        <div>
        <h1 className="text-2xl text-indigo-500">
            <Link href="/">Search GutendexAPI</Link>
        </h1>
        </div>
    </div>

      <main className="w-8/12 mx-auto">
        

        <div className="m-2 p-4">        
            <BookDetails book={book} loading={loading} />
        </div>  

        <div className="m-2 p-4 border border-indigo-500 rounded">
            <p className="text-xl text-blue-400">Your review of "{book.title}".</p>
            <ReviewForm bookID={book.id} />
        </div>  

        <div className="m-2 p-4">        
            {book.reviews.map(review =>{
                <div key={review.id}>
                    <p>Rating: {review.rating}/5</p>
                    <p>Comment:</p>
                    <p>{reviews.comment}</p>
                </div>
            })}
        </div>  
      </main>
    </div>
  )
}

function BookDetails({book, loading}){
  if (loading) return (
    <p className="text-small text-center text-indigo-500">Loading...</p>
  )
  
  if(book && !loading){
  return (
    <div>
      <div className="flex justify-between gap-4">
        <Link href={{pathname: `/books/book/${book.id}`}}>
          <span className="text-3xl text-indigo-500">{book.title}</span>
        </Link>
        <div className="flex-col">
          <p className="text-lg text-blue-500">Rating: 5/5</p>
          <p className="text-xs text-blue-300 text-center">
            <Link href={{pathname: `/books/book/${book.id}/reviews`}}>
                View all reviews
            </Link>
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
    </div>
  )}
}


function ReviewList({reviews, loading}){
    if (loading) return <p>Loading...</p>

    if (reviews && !loading){
        return (
            <div>
                <p className='text-xl'>Reviews</p>
                <div className=''>
                {reviews.map(review =>{
                    <div key={review.id}>
                        <p>Rating: {review.rating}/5</p>
                        <p>Comment:</p>
                        <p>{reviews.comment}</p>
                    </div>
                })}
                </div>
            </div>
        )
    }
}


function ReviewForm({bookID}){
  const [reviewState, setReviewState] = useState({
    rating: 5,
    comment: ""
  });

  async function postReview(){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${bookID}/post-review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          book_id: bookID,
          rating: parseFloat(reviewState.rating),
          comment: reviewState.comment,
      })
    })
    const json = await res.json();
  }

  function handleChange(e){
    setReviewState({
      ...reviewState,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    postReview();
  }

  return (
    <div className='p-4'>
      <form className="pt-3" onSubmit={handleSubmit}>
        <label className="block flex pb-2">
          <span>Rating: </span>
          <select name="rating" value={reviewState.rating} onChange={handleChange} className="rounded bg-white text-black ml-2">       
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
          <span className='px-2'>out of 5</span>
        </label>
        <textarea name="comment" value={reviewState.comment} onChange={handleChange} 
        className="
          form-control
          block
          w-full
          my-4
          py-2
          px-2
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        " placeholder="Write your review here..." rows="4" cols="50" />
        <button className="my-4 py-2 px-4 rounded bg-indigo-400 hover:bg-indigo-600">
          Post your review
        </button>
      </form>
    </div>
  )
}