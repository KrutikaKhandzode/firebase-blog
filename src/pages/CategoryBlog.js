import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import BlogSection from '../components/BlogSection';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const CategoryBlog = ({setActive}) => {
    const [categoryBlogs, setCategoryBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { category } = useParams();

    const getCategoryBlogs = async () => {
        setLoading(true);
        const blogRef = collection(db, "blogs");
        const categoryBlogQuery = query(
            blogRef,
            where("category", "==", category)
        );
        const docSnapshot = await getDocs(categoryBlogQuery);
        let categoryBlogs = [];
        docSnapshot.forEach((doc) => {
            categoryBlogs.push({ id: doc.id, ...doc.data() });
        });
        setCategoryBlogs(categoryBlogs);
        setLoading(false);
    }

    useEffect(() => {
        getCategoryBlogs();
        setActive(null);
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            <div className="container">
                <div   div className="row">
                    <div className="blog-heading text-center py-2 mb-4">
                        Category <strong>{category.toLocaleUpperCase()}</strong>
                    </div>
                    {categoryBlogs?.map((item) => (
                        <div className="col-md-6" key={item.id}>
                            <BlogSection {...item} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CategoryBlog;
