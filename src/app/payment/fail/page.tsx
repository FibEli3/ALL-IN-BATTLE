import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

export default function PaymentFailPage() {
  return (
    <main className="status-page">
      <Image src="/event/logo.png" alt="ALL IN BATTLE" width={1920} height={1920} />
      <p>Не получилось</p>
      <h1>Ошибка<br />отправки</h1>
      <p className="status-copy">Проверьте файл чека и попробуйте отправить заявку ещё раз.</p>
      <div><Link href="/#registration">К регистрации</Link><a href="https://t.me/all_in_battle" target="_blank" rel="noreferrer"><span>Нужна помощь</span><ArrowUpRightIcon className="external-arrow" aria-hidden="true" /></a></div>
    </main>
  );
}
