import Image from "next/image";
import Link from "next/link";

export default function PaymentFailPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white px-5 py-10 md:px-8 md:py-14">
      <Image
        src="/decor/flower-side-left.png"
        alt=""
        width={260}
        height={260}
        className="pointer-events-none absolute bottom-[-20px] left-[-40px] h-auto w-[220px] opacity-85 md:w-[280px]"
      />
      <Image
        src="/decor/flower-side-right.png"
        alt=""
        width={260}
        height={260}
        className="pointer-events-none absolute right-[-24px] top-[-20px] h-auto w-[220px] opacity-85 md:w-[280px]"
      />

      <section className="relative z-10 mx-auto flex w-full max-w-[920px] flex-col items-center rounded-[34px] border border-[#cdcdcd] bg-[#fafafa] px-6 py-14 text-center md:px-12 md:py-16">
        <h1 className="font-display text-[42px] font-black uppercase leading-none tracking-tight text-[#bd2d2d] md:text-[72px]">
          Оплата Не Прошла
        </h1>
        <p className="mt-8 max-w-[680px] text-[22px] font-medium leading-[1.25] text-[#1b1b1b] md:text-[30px]">
          Платёж не был завершён. Проверь данные карты и попробуй ещё раз.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/#registration"
            className="rounded-full bg-[#2a6a34] px-8 py-4 text-[18px] font-semibold leading-none text-white transition hover:bg-[#21562a]"
          >
            Вернуться К Регистрации
          </Link>
          <a
            href="https://t.me/all_in_battle"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#2a6a34] px-8 py-4 text-[18px] font-semibold leading-none text-[#2a6a34] transition hover:bg-[#2a6a34] hover:text-white"
          >
            Связаться В Telegram
          </a>
        </div>
      </section>
    </main>
  );
}

