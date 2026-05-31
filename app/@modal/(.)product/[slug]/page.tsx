import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { ProductDetail } from "@/components/product-detail";
import { ProductModal } from "@/components/product-modal";

export default async function InterceptedProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "ACTIVE") notFound();
  const related = await getRelatedProducts(product.categoryId, product.id, 4);

  return (
    <ProductModal>
      <ProductDetail product={product} related={related} variant="modal" />
    </ProductModal>
  );
}
