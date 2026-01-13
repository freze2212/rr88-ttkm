import Image from "next/image";

type Props = { className?: string };

const Footer = ({ className = "" }: Props) => {
  return (
    <footer className={`bg-[#3c4c52] text-white py-10 mt-10 ${className}`}>
      <div className="max-w-[1600px] mx-auto px-4 ">
        {/* ===== TOP ===== */}

        {/* Desktop / Tablet: 2 khối + vạch ngăn cách dọc */}
        <div className="hidden md:flex items-stretch justify-center gap-6 lg:gap-8">
          {/* Khối logo bên trái */}
          <div className="flex items-center">
            <Image
              src="/logo-ft.webp"
              alt="logo xx88"
              width={720}
              height={280}
              className="h-auto w-auto max-h-[130px]"
              priority
            />
          </div>

          {/* Vạch ngăn cách dọc */}
          <div className="w-px bg-white/40 self-stretch rounded-full" />

          {/* Banner + text (phải) */}
          <div className="flex flex-col items-center md:items-start justify-center gap-3">
            {/* <Image
              src="/chinhphuc.png"
              alt="Cùng bạn chinh phục đỉnh cao"
              width={720}
              height={160}
              className="h-auto w-auto max-w-[560px]"
              priority
            /> */}
            <div className="text-center md:text-left leading-tight">
              <Image
                src="/brandFT.webp"
                alt="Cùng bạn chinh phục đỉnh cao"
                width={800}
                height={200}
                sizes="100vw"
                className="h-auto w-auto max-w-[452px]"
                priority
              />
            </div>
          </div>
        </div>

        {/* Mobile: CHỈ hiện brandFT.png full-width */}
        <div className="md:hidden">
          <div className="text-center leading-tight">
            <Image
              src="/brandFT.png"
              alt="Cùng bạn chinh phục đỉnh cao"
              width={1200}
              height={400}
              sizes="100vw"
              className="mx-auto w-full h-auto max-w-[640px]"
              priority
            />
          </div>
        </div>

        {/* ===== LINKS ===== */}
        <div className="mt-8 flex flex-wrap justify-center md:justify-between w-full gap-x-4 gap-y-2 text-xs md:text-sm font-normal">
          <a href="https://www.0xx88.com/help#aboutus" className="hover:underline !font-normal">
            Giới thiệu về XX88
          </a>
          <span>|</span>
          <a href="https://www.0xx88.com/help#deposit" className="hover:underline !font-normal">
            Điều khoản & điều kiện
          </a>
          <span>|</span>
          <a href="https://www.0xx88.com/help#responsibility" className="hover:underline !font-normal">
            Chơi có trách nhiệm
          </a>
          <span>|</span>
          <a href="https://www.0xx88.com/help#disclaimer" className="hover:underline !font-normal">
            Miễn trách nhiệm
          </a>
          <span>|</span>
          <a href="https://www.0xx88.com/help#privacy" className="hover:underline !font-normal">
            Quyền riêng tư
          </a>
          <span>|</span>
          <a href="https://www.0xx88.com/help" className="hover:underline !font-normal">
            Hướng dẫn nạp rút
          </a>
          <span>|</span>
          <a href="https://www.0xx88.com/help#contact" className="hover:underline !font-normal">
            Câu hỏi thường gặp
          </a>
          <span>|</span>
          <a href="https://xx88cskh.pages.dev/" className="hover:underline !font-normal">
            Liên hệ
          </a>
        </div>

        {/* ===== ICONS ===== */}
        <div className="mt-6 flex flex-wrap items-center justify-center md:justify-between w-full md:w-auto gap-6">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <Image
              key={n}
              src={`/icon_${n}.png`}
              alt={`Icon ${n}`}
              width={32}
              height={32}
              className="object-contain"
            />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
