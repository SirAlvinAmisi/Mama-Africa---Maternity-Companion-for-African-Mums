// src/components/articles/ArticleCardList.jsx
import ArticleCard from './ArticleCard';

export default function ArticleCardList() {
  // Mock data - replace with real API later
  const mockArticles = [
    {
      id: 1,
      title: "Pregnancy Nutrition Guide",
      content: "Essential foods rich in iron and folate for healthy fetal development...",
      category: "Nutrition",
      media_url: "",
      created_at: new Date(),
      author: {
        profile: {
          full_name: "Kipsang"
        }
      }
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockArticles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}