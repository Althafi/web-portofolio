import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <Badge>404</Badge>
      <h1 className="mt-4 text-title text-fg">Halaman tidak ditemukan</h1>
      <p className="mt-3 max-w-[460px] text-base text-muted">
        Proyek atau halaman yang kamu cari tidak ada, atau alamatnya sudah berubah.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Button asChild variant="primary" size="md">
          <Link href="/proyek">Lihat semua proyek</Link>
        </Button>
        <Button asChild variant="secondary" size="md">
          <Link href="/">Ke beranda</Link>
        </Button>
      </div>
    </Container>
  );
}
