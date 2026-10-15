import { useEffect, useRef, useState } from 'react';
import ProductCard from '../product/ProductCard';
import './RecommendationSection.css';

const RecommendationSection = ({
  eyebrow,
  title,
  subtitle,
  fetchProducts,
  dependencyKey,
  skeletonCount = 4,
  columns = 4,
  layout = 'section',
  onLoaded
}) => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const fetchRef = useRef(fetchProducts);
  const onLoadedRef = useRef(onLoaded);
  fetchRef.current = fetchProducts;
  onLoadedRef.current = onLoaded;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchRef.current()
      .then((res) => {
        if (cancelled) return;
        const list = res?.products || [];
        setProducts(list);
        setMeta({ strategy: res?.strategy, personalized: res?.personalized });
        if (onLoadedRef.current) onLoadedRef.current(list);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dependencyKey]);

  if (!loading && products.length === 0) return null;

  const content = (
    <>
      <div className="rec-head">
        <div>
          {eyebrow && <span className="rec-eyebrow">{eyebrow}</span>}
          <h2 className="rec-title">{title}</h2>
          {subtitle && <p className="rec-subtitle">{typeof subtitle === 'function' ? subtitle(meta) : subtitle}</p>}
        </div>
      </div>
      <div className={`rec-grid rec-grid--${columns}`}>
        {loading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <div className="rec-skeleton" key={index}>
                <div className="rec-skeleton__image" />
                <div className="rec-skeleton__line" />
                <div className="rec-skeleton__line rec-skeleton__line--short" />
              </div>
            ))
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </>
  );

  if (layout === 'inline') {
    return <section className="rec-section rec-section--inline">{content}</section>;
  }

  return (
    <section className="rec-section">
      <div className="container">{content}</div>
    </section>
  );
};

export default RecommendationSection;
