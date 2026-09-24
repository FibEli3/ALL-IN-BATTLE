import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

export default function PaymentSuccessPage() {
  return (
    <main className="status-page">
      <Image src="/event/logo.png" alt="ALL IN BATTLE" width={1920} height={1920} />
      <p>Готово / 2026</p>
      <h1>Заявка<br />отправлена</h1>
      <p className="status-copy">Мы получили ваши данные и чек. До встречи на ALL IN BATTLE 5.</p>
      <div><Link href="/">На главную</Link><a href="https://t.me/all_in_battle" target="_blank" rel="noreferrer"><span>Telegram</span><ArrowUpRightIcon className="external-arrow" aria-hidden="true" /></a></div>
    </main>
  );
}
