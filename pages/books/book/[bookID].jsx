import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react';


export async function getServerSideProps(context) {
    const { bookID } = context.query;

    // Fetch data from external API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${bookID}`);
    var data = await res.json();
  
    // Pass data to the page via props
    return { props: { data } }
  }


const BookView = ({ data }) => {
    const [book, setBook] = useState();
    
    useEffect(() => {
            setBook(data)
        }
    )

    if (!book) return <p>Loading...</p>
    
    return (
    <div className="container">
        <Head>
            <title>{book.title} | GutendexAPI</title>
            <meta name="description" content="NextJS app using Gutendex API" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="border-b-2 border-indigo-500 w-screen m-0 p-0">
            <div className='p-4'>
                <h1 className="text-2xl text-indigo-500">
                    <Link href="/">Search GutendexAPI</Link>
                </h1>
            </div>
        </div>
        <main className="h-0 lg:px-4 lg:mx-4 md:flex-col lg:grid lg:grid-cols-2 lg:gap-4">   
            <div>
                <div className="m-2 p-4 md:p-0">        
                    <BookDetails book={book} />
                </div>  
                <div className="m-2 p-4 md:p-0">
                    <p className="text-xl text-blue-400">Your review of 
                        <span className='text-blue-500 italic'> {book.title}</span>.
                    </p>
                    <ReviewForm book={book} setBook={setBook} />
                </div>
            </div>  
            <div className='h-full lg:overflow-y-auto'>
                <div className="m-2 p-4 md:p-0">    
                    <p className='text-2xl text-blue-400'>Reviews</p>
                    <ReviewList book={book} />
                </div> 
            </div>
      </main>
    </div>
  )
}

const BookDetails = ({book}) => {
    if (!book) return (
        <p className="text-small text-center text-indigo-500">Loading...</p>
    )

    return (
    <div>
        <div className="lg:flex md:flex-col justify-between gap-2">
        <Link href={{pathname: `/books/book/${book.id}`}}>
            <span className="text-2xl text-indigo-500">{book.title}</span>
        </Link>
        <p className="text-lg text-blue-400 pt-1">
            Rating: {book.rating ? book.rating : "-"}/5
        </p>
        </div>
        <div className="flex">
            <ul className="list-none">
            {book.authors?.map(author => {
                return (
                <li className="text-indigo-200" key={author.name}>
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
    )
}


const ReviewList = ({book}) => {
    if (!book) return <p className='text-small text-center text-indigo-500'>Loading...</p>
    
    if (book && book.reviews && !book.reviews.length) return (
        <p className='text-small text-center text-indigo-500'>
            No reviews. Add the first!
        </p>
    )
    
    return (
        <div>
            {book.reviews?.map(review =>{
            return (
            <div className='px-4 py-4 my-4 border-b border-indigo-500' key={review.id}>
                <div className="lg:flex md:flex-col justify-between gap-4">
                    <p className='text-indigo-500'>
                        Rating: {review.rating ? review.rating : "-"}/5
                    </p>
                    <p className='text-xs text-indigo-200'>
                        {review.created_at}
                    </p>
                </div>
                <div className="flex-col py-2 min-h-full">
                    <p className='pt-1 text-xs text-blue-200 font-bold'>User commented:</p>
                    <div className='rounded my-2'>
                        <p className='text-sm py-2 px-4 text-blue-400 text-justify italic'>
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


export const ReviewForm = ({book, setBook}) => {
    const [review, setReview] = useState({
        rating: 5,
        comment: "",
    })

    const [errors, setErrors] = useState({
        rating: "",
        comment: "",
    })

    async function postReview(){
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${book.id}/post-review`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                book_id: book.id,
                rating: parseFloat(review.rating),
                comment: review.comment,
            })
        })

        const newReview = await res.json();
        setBook({
            ...book,
            reviews: [newReview, ...book.reviews]
        })
    }

    function handleChange(e){
        setReview({
            ...review,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        postReview();

        setReview({
            rating: 5,
            comment: '',
        })
    }

    return (
    <div className='py-4'>
        <form onSubmit={handleSubmit}>
            <div className="m-0 p-0">
                <div className='flex'>
                    <span>Rating: </span>
                    <select name="rating" value={review.rating} onChange={handleChange} 
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
                <textarea name="comment" value={review.comment} onChange={handleChange} 
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