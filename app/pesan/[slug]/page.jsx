import HalamanPesan from "@/components/katalog/HalamanPesan";
import { MOBIL, cariMobil } from "@/data/mobil";

export function generateStaticParams() {
  return MOBIL.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `Pesan ${cariMobil(slug)?.nama ?? "Mobil"}` };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <HalamanPesan slug={slug} />;
}
