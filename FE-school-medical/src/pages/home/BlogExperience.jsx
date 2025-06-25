import React from "react";
import pic1 from "../../assets/img/pic1.jpg";
import pic2 from "../../assets/img/pic2.jpg";
import pic3 from "../../assets/img/pic3.jpg";
import pic4 from "../../assets/img/pic4.jpg";
import pic5 from "../../assets/img/pic5.jpg";
import pic6 from "../../assets/img/pic6.jpg";

const BLOGS = [
  {
    title: "Common School Diseases and Prevention",
    category: "Disease Prevention",
    author: "Phu Xuyen Medical Center",
    date: "10/06/2024",
    readTime: "7 min read",
    image: pic1,
    link: "https://trungtamytephuxuyen.vn/index.php/bai-tuyen-truyen/benh-hoc-duong-thuong-gap-va-cach-phong-tranh-146.html",
  },
  {
    title: "Simple Home Exercises for Students",
    category: "Physical Education",
    author: "VnExpress",
    date: "12/06/2024",
    readTime: "6 min read",
    image: pic2,
    link: "https://vnexpress.net/nhung-bai-tap-the-duc-don-gian-tai-nha-cho-hoc-sinh-4329750.html",
  },
  {
    title: "9 Effective Ways to Reduce Study Stress",
    category: "Mental Health",
    author: "NKSPA",
    date: "08/06/2024",
    readTime: "8 min read",
    image: pic3,
    link: "https://nkspa.vn/9-cach-giam-stress-trong-hoc-tap-phuong-phap-hieu-qua/#:~:text=C%C3%A1ch%20Gi%E1%BA%A3m%20Stress%20Trong%20H%E1%BB%8Dc%20T%E1%BA%ADp%3A%20Ph%C6%B0%C6%A1ng%20Ph%C3%A1p,c%C3%B3%20t%C3%A1c%20%C4%91%E1%BB%99ng%20l%E1%BB%9Bn%20%C4%91%E1%BA%BFn%20c%E1%BA%A3m%20x%C3%BAc.%20",
  },
  {
    title: "The Importance of Sleep for Student Health",
    category: "Sleep",
    author: "Tesla School",
    date: "05/06/2024",
    readTime: "5 min read",
    image: pic4,
    link: "https://tesla.edu.vn/parent_learning/tam-quan-trong-cua-giac-ngu-doi-voi-suc-khoe-hoc-sinh/#:~:text=M%E1%BB%99t%20s%E1%BB%91%20l%E1%BB%A3i%20%C3%ADch%20c%E1%BB%A7a%20gi%E1%BA%A5c%20ng%E1%BB%A7%20%C4%91%E1%BB%91i,thi%E1%BB%87n%20kh%E1%BA%A3%20năng%20mi%E1%BB%85n%20d%E1%BB%8Bch%20cho%20c%C6%A1%20th%E1%BB%83.",
  },
  {
    title: "Building Healthy Eating Habits for Students",
    category: "Nutrition",
    author: "The Dewey Schools",
    date: "03/06/2024",
    readTime: "6 min read",
    image: pic5,
    link: "https://thedeweyschools.edu.vn/tao-dung-thoi-quen-an-uong-lanh-manh-cho-hoc-sinh/",
  },
  {
    title: "4 Ways to Improve Health During Exam Season",
    category: "Mental Health",
    author: "VnExpress",
    date: "01/06/2024",
    readTime: "5 min read",
    image: pic6,
    link: "https://vnexpress.net/4-cach-giup-si-tu-tang-cuong-suc-khoe-mua-thi-4905504.html",
  },
];

const categoryColors = {
  "Mental Health": "bg-blue-500",
  "Disease Prevention": "bg-pink-500",
  "Physical Education": "bg-lime-600",
  Sleep: "bg-indigo-500",
  Nutrition: "bg-green-500",
};

const BlogExperience = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-6">
      <h3 className="text-3xl font-bold text-center text-blue-800 mb-2">
        Experience Sharing Blog
      </h3>
      <p className="text-center text-gray-500 mb-10">
        In-depth articles from health and education experts, sharing practical
        experiences in student healthcare.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOGS.map((blog, idx) => (
          <a
            href={blog.link}
            key={idx}
            className="block rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition"
            style={{ textDecoration: "none" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="relative h-40">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                  categoryColors[blog.category] || "bg-gray-400"
                }`}
              >
                {blog.category}
              </span>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2 text-gray-900">
                {blog.title}
              </h4>
              <div className="flex items-center text-xs text-gray-500 mb-2 gap-2 flex-wrap">
                <span>👤 {blog.author}</span>
                <span>📅 {blog.date}</span>
                <span>⏱ {blog.readTime}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default BlogExperience;
