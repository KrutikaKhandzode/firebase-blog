import { query, collection, getDocs, limit, startAfter, endBefore,endAt,limitToLast } from 'firebase/firestore';
import { orderBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import BlogSection from '../components/BlogSection';
import { db } from "../firebase";
import Pagination from '../components/Pagination';
import Spinner from "../components/Spinner";

const Blogs = ({setActive}) => {
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastVisible, setLastVisible] = useState(null);
    const [noOfPages, setNoOfPages] = useState(null);
    const [count, setCount] = useState(null);

    useEffect(() => {
        getBlogsData();
        getTotalBlogs();
        setActive("blogs"); 
        }, []);

    if(loading){
        return <Spinner/>
    }

    const getBlogsData = async () => {
        setLoading(true);
        const blogRef = collection(db, "blogs");
        const first = query(blogRef, orderBy("title"), limit(4));
        const docSnapshot = await getDocs(first);
        setBlogs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setCount(docSnapshot.size);
        setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
        setLoading(false);
    };

    const getTotalBlogs = async () => {
        const blogRef = collection(db, "blogs");
        const docSnapshot = await getDocs(blogRef);
        const totalBlogs = docSnapshot.size;
        const totalPage = Math.ceil(totalBlogs / 4);
        setNoOfPages(totalBlogs);
    };

    const fetchMore = async () => {
        setLoading(true);
        const blogRef = collection(db, "blogs");
        const nextBlogsQuery = query(blogRef, orderBy("title"), startAfter(lastVisible), limit(4));
        const nextBlogsSnapshot = await getDocs(nextBlogsQuery);
        setBlogs(nextBlogsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setCount(nextBlogsSnapshot.size);
        setLastVisible(nextBlogsSnapshot.docs[nextBlogsSnapshot.docs.length - 1]);
        setLoading(false);
    };

    const fetchPrev = async () => {
        setLoading(true);
        const blogRef = collection(db, "blogs");
        const end =
          noOfPages !== currentPage ? endAt(lastVisible) : endBefore(lastVisible);
        const limitData =
          noOfPages !== currentPage
            ? limit(4)
            : count <= 4 && noOfPages % 2 === 0
            ? limit(4)
            : limitToLast(4);
        const prevBlogsQuery = query(blogRef, orderBy("title"), end, limitData);
        const prevBlogsSnaphot = await getDocs(prevBlogsQuery);
        setBlogs(
          prevBlogsSnaphot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setCount(prevBlogsSnaphot.size);
        setLastVisible(prevBlogsSnaphot.docs[prevBlogsSnaphot.docs.length - 1]);
        setLoading(false);
      
    };

    const handlePageChange = (value) => {
        if (value === "Next") {
            setCurrentPage((page) => page + 1);
            fetchMore();
        } else if (value === "Prev") {
            setCurrentPage((page) => page - 1);
            fetchPrev();
        }
    };

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className='blog-heading text-center py-2 mb-4'>
                        Daily Blogs
                    </div>
                    {blogs?.map((blog) => (
                        <div className="col-md-6" key={blog.id}>
                            <BlogSection {...blog} />
                        </div>
                    ))}
                </div>
                <Pagination 
                currentPage={currentPage} 
                noOfPages={noOfPages} 
                handlePageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default Blogs;
