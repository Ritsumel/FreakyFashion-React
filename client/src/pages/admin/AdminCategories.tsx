import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';

type Category = {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  productCount: number;
};

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = async () => {
    const res = await fetch('http://localhost:5000/api/admin/categories');
    const data = await res.json();
    setCategories(data.categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteCategory = async (id: number) => {
    if (!confirm('Är du säker?')) return;

    await fetch(
      `http://localhost:5000/api/admin/categories/${id}/delete`,
      { method: 'POST' }
    );

    fetchCategories();
  };

  return (
    <section id="categories-admin">
      <div className="categories-view-all">

        <div className="box1">
          <SearchBar
            value={searchTerm}
            placeholder="Filtrera kategorier"
            onChange={setSearchTerm}
          />

          <Link to="/admin/categories/new" className="btn-new btn-theme">
            Ny kategori
          </Link>
        </div>

        <div className="categories-view">

          <div className="category-details">
            <h6>Namn</h6>
            {filteredCategories.map(c => (
              <p key={c.id}>
                <Link to={`/admin/categories/${c.id}`}>
                  {c.name}
                </Link>
              </p>
            ))}
          </div>

          <div className="category-details">
            <h6>Produkter</h6>
            {filteredCategories.map(c => (
              <p key={c.id}>{c.productCount}</p>
            ))}
          </div>

          <div className="category-details">
            <h6></h6>
            {filteredCategories.map(c => (
              <button
                key={c.id}
                className="btn-delete"
                onClick={() => deleteCategory(c.id)}
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AdminCategories;
