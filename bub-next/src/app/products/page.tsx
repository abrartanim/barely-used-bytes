'use client';
import ProductCard from '@/components/ProductCard';
import { products } from '@/components/pages/mockData';
import Link from 'next/link';

export default function ProductsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <Link href={`/products/${product.slug}`} key={product.id}>
            <ProductCard
              name={product.name}
              price={product.price}
              condition={product.condition}
              imageUrl={product.imageUrl}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
