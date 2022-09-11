import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';

const BookView = () => {
  const router = useRouter();
  const { bookID } = router.query;

  const [book, setBook] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBook() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${bookID}`);
        const json = await res.json();
        
        setBook(json);
        setReviews(json.reviews); 
    }
    fetchBook();
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
        <main className="px-4 mx-4 grid grid-cols-2 gap-">   
            <div className='border-r border-solid border-indigo-500'>
                <div className="m-2 p-4">        
                    <BookDetails book={book} loading={loading} />
                </div>  
                <div className="m-2 p-4">
                    <p className="text-xl text-blue-400">Your review of 
                        <span className='text-blue-500 italic'> {book.title}</span>.
                    </p>
                    <ReviewForm book={book} reviews={reviews} setReviews={setReviews}/>
                </div>
            </div>  
            <div>
                <div className="m-2 p-4">    
                    <p className='text-2xl text-blue-400'>Reviews</p>
                    <ReviewList reviews={reviews} />
                </div> 
            </div>
      </main>
    </div>
  )
}

const BookDetails = (props) => {
    var { book, loading } = props;

    if (loading) return (
        <p className="text-small text-center text-indigo-500">Loading...</p>
    )

    if(book && !loading){
    return (
    <div>
        <div className="flex justify-between gap-4">
        <Link href={{pathname: `/books/book/${book.id}`}}>
            <span className="text-2xl text-indigo-500">{book.title}</span>
        </Link>
        <p className="text-lg text-blue-400 pt-1">
            Rating: {book.rating ? book.rating : "-"}/5
        </p>
        </div>
        <div className="flex">
        <span className="text-md text-indigo-300">Author(s): </span> 
        <ul className="list-none">
        {book.authors?.map(author => {
            return (
            <li className="pl-2 text-indigo-200" key={author.name}>
                {author.name}
            </li>)
        })}
        </ul>
        </div>
        <div className="text-xs text-indigo-300 pt-1">
        <span>Languages: {book.languages}</span> 
        <span> | </span> 
        <span>Downloads: {book.download_count}</span>
        </div>
    </div>
    )}
}


const ReviewList = (props) => {
    var { reviews, loading } = props;

    if (loading) return <p className='text-small text-center text-indigo-500'>Loading...</p>
    
    if (!reviews && !loading) return (
        <p className='text-small text-center text-indigo-500'>
            No reviews...
        </p>
    )

    if (reviews && !loading){
        return (
            <div>
                {reviews?.map(review =>{
                return (
                <div className='py-4 my-4 border-b border-indigo-500' key={review.id}>
                    <div className="flex justify-between gap-4">
                        <p className='text-lg text-indigo-500'>
                            Rating: {review.rating ? review.rating : "-"}/5
                        </p>
                        <p className='text-xs text-indigo-200'>
                            {review.created_at}
                        </p>
                    </div>
                    <div className="flex-col py-2 min-h-full">
                        <p className='pt-1 text-sm text-blue-200 font-bold'>User commented:</p>
                        <div className='rounded my-2'>
                            <p className='py-2 px-4 text-blue-400 text-justify italic'>
                                {review.comment ? review.comment : "User did not add a comment"}
                            </p>
                        </div>
                    </div>
                </div>
                )
            })}
        </div>
        )
    }
}


const ReviewForm = (props) => {
    var { book, reviews, setReviews } = props;

    const [reviewState, setReviewState] = useState({
        rating: 5,
        comment: ""
    });

    const [errors, setErrors] = useState({
        rating: "",
        comment: ""
    });

    async function postReview(){
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${book.id}/post-review`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                book_id: book.id,
                rating: parseFloat(reviewState.rating),
                comment: reviewState.comment,
            })
        })
        const json = await res.json();
        setReviews([json, ...reviews ])
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
        setReviewState({
            rating: 5,
            comment: "",
        })
    }

    return (
    <div className='py-4'>
        <form onSubmit={handleSubmit}>
            <div className="m-0 p-0">
                <div className='flex'>
                    <span>Rating: </span>
                    <select name="rating" value={reviewState.rating} onChange={handleChange} 
                        className="rounded bg-white text-black ml-2" required>       
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                    </select>
                    <span className='px-2'>out of 5</span>
                </div>
                <span className='px-2 pt-0 mt-0 text-xs text-red-500 italic'>
                    {errors.rating ? errors.rating : ''}
                </span>
            </div>
            <div className="p-0 m-0">
                <textarea name="comment" value={reviewState.comment} onChange={handleChange} 
                className="
                    form-control
                    block
                    w-full
                    mt-4
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
                <span className='px-2 pt-0 mt-0 text-xs text-red-500 italic'>
                    {errors.comment ? errors.comment : ''}
                </span>
            </div>
            <button className="my-4 py-2 px-4 rounded bg-indigo-400 hover:bg-indigo-600">
                Post your review
            </button>
        </form>
    </div>
    )
}

export default BookView