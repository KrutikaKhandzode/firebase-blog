import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import BlogSection from '../components/BlogSection';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const TagBlog = ({setActive}) => {
    const [tagBlogs, setTagBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { tag } = useParams();

    const getTagBlogs = async () => {
        setLoading(true);
        const blogRef = collection(db, "blogs");
        const tagBlogQuery = query(
            blogRef,
            where("tags", "array-contains", tag)
        );
        const docSnapshot = await getDocs(tagBlogQuery);
        let tagBlogs = [];
        docSnapshot.forEach((doc) => {
            tagBlogs.push({ id: doc.id, ...doc.data() });
        });
        setTagBlogs(tagBlogs);
        setLoading(false);
    }

    useEffect(() => {
        getTagBlogs();
        setActive(null);
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="blog-heading text-center py-2 mb-4">
                        Tag: <strong>{tag.toLocaleUpperCase()}</strong>
                    </div>
                    {tagBlogs?.map((item) => (
                        <div className="col-md-6" key={item.id}>
                            <BlogSection {...item} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TagBlog;
