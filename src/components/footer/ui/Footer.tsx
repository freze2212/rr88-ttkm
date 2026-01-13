"use client";

import Image from "next/image";
import React, { useState } from "react";

const Footer: React.FC = () => {
  const [showExpand, setShowExpand] = useState(false);

  // ✅ LINKS giống mockup
  const links = [
    { label: "Giới thiệu về RR88", url: "" },
    { label: "Điều khoản & điều kiện", url: "" },
    { label: "Chơi có trách nhiệm", url: "" },
    { label: "Miễn trách nhiệm", url: "" },
    { label: "Quyền riêng tư", url: "" },
    { label: "Hướng dẫn nạp rút", url: "" },
    { label: "Câu hỏi thường gặp", url: "" },
    { label: "Liên hệ", url: "" },
  ];

  const socialLinks = {
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    telegram: "https://t.me",
  } as const;

  type SocialKey = keyof typeof socialLinks;
  const isExternal = (url?: string) => !!url && url.startsWith("http");

  return (
    <>
      {/* Desktop Footer */}
      <footer className="md:block hidden py-[33px] px-[350px]">
        <div className="relative">
          <div className="flex items-end justify-between">
            <Image
              src="/footer/rr88-kjc.png"
              width={618}
              height={174}
              alt="Footer Banner"
            />

            <div className="relative w-fit h-fit">
              {showExpand ? (
                <Image
                  src="/footer/kjc-juventus-expand.png"
                  width={541}
                  height={154}
                  alt="Footer Banner"
                />
              ) : (
                <Image
                  src="/footer/kjc-juventus.png"
                  width={541}
                  height={200}
                  alt="Footer Banner"
                />
              )}

              <div
                onClick={() => setShowExpand(!showExpand)}
                className="absolute bottom-0 left-0 w-[60px] h-[20px] cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="py-6">
          <div className="mx-auto">
            {/* Navigation Links */}
            <div
              className="w-full flex items-center justify-between gap-2 mb-6 text-gray-600"
              style={{
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "131%",
                letterSpacing: "0%",
                textAlign: "center",
              }}
            >
              {links.map((link, index) => (
                <React.Fragment key={index}>
                  <a
                    href={link.url || "#"}
                    className="hover:text-[#868DA5] transition-colors font-sfpro"
                    target={isExternal(link.url) ? "_blank" : undefined}
                    rel={
                      isExternal(link.url) ? "noopener noreferrer" : undefined
                    }
                  >
                    {link.label}
                  </a>
                  {index < links.length - 1 && (
                    <span className="text-gray-400">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Icons + Social */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Image
                  key={i}
                  src={`/footer/icon/${i + 1}.png`}
                  width={100}
                  height={100}
                  alt={`${i + 1}`}
                  className="h-8 w-auto"
                />
              ))}

              {(Object.keys(socialLinks) as SocialKey[]).map((k) => (
                <a
                  key={k}
                  href={socialLinks[k]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={`/footer/icon/${
                      k === "facebook" ? "fb" : k === "youtube" ? "youtube" : k
                    }.png`}
                    width={100}
                    height={100}
                    alt={k}
                    className="h-8 w-auto"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ✅ Mobile Footer (GIỐNG MOCKUP) */}
      <footer
        className="
          md:hidden block
          bg-[linear-gradient(180deg,#0D1329_0%,#101F53_50%,#0D1329_100%)]
          py-4
        "
      >
        <div className="px-3">
          <div className="max-w-[520px] mx-auto">
            {/* KJC | JUVENTUS Section */}
            <div
              className="w-[373px] h-[141px] max-w-full max-h-[141px] mx-auto mb-4 rounded-lg flex items-center gap-1 px-2"
              style={{
                background: 'linear-gradient(180deg, rgba(25, 38, 85, 1), rgba(35, 85, 146, 1))',
                border: '1px solid rgba(105, 114, 147, 1)',
              }}
            >
              {/* Text Section */}
              <div className="flex-1">
                <h3 
                  className="text-white mb-1"
                  style={{ 
                    fontFamily: '"Roboto", system-ui, sans-serif',
                    fontWeight: 900,
                    fontSize: '13px',
                    lineHeight: '140%',
                    letterSpacing: '-2%',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  KJC | JUVENTUS – ĐỐI TÁC ĐỘC QUYỀN KHU VỰC CHÂU Á
                </h3>
                <p 
                  className="text-white"
                  style={{ 
                    fontFamily: '"Roboto", system-ui, sans-serif',
                    fontSize: '9px',
                    lineHeight: '120%',
                  }}
                >
                  KJC hợp tác độc quyền với CLB Juventus tại
                  châu Á, đưa thương hiệu vươn tầm quốc tế.
                  Juventus – biểu tượng bóng đá Ý với nhiều
                  danh hiệu lẫy lừng – trở thành đại sứ độc
                  quyền, nâng uy tín và ...
                </p>
                <button 
                  className="text-white mt-1 underline"
                  style={{ 
                    fontFamily: '"Roboto", system-ui, sans-serif',
                    fontSize: '9px',
                  }}
                >
                  Ẩn bớt
                </button>
              </div>
              
              {/* Image Section */}
              <div className="flex-shrink-0">
                <Image
                  src="/collab.webp"
                  alt="KJC Juventus Collaboration"
                  width={149}
                  height={121}
                  className="w-[149px] h-[121px] object-contain"
                />
              </div>
            </div>

            {/* 2 Images Section */}
            <div className="flex items-center justify-center gap-3 mb-4 max-w-full overflow-hidden">
              <Image
                src="/juven-player.webp"
                alt="Juventus Player"
                width={157}
                height={108}
                className="w-[157px] h-[108px] max-w-[45%] max-h-[108px] object-contain"
              />
              <Image
                src="/text-ft.webp"
                alt="Footer Text"
                width={212}
                height={105}
                className="w-[212px] h-[105px] max-w-[50%] max-h-[105px] object-contain"
              />
            </div>

            {/* TOP LOGOS */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <Image
                src="/footer/rr88KjcMB.png"
                width={239}
                height={43}
                alt="rr88-kjc"
                className="w-[239px] h-[43px] object-contain"
              />
            </div>

            {/* LINKS (3 dòng như mockup) */}
            <div className="text-[11px] font-sfpro text-[#868DA5] space-y-2 text-center leading-[1.4]">
              {/* line 1 */}
              <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
                {links.slice(0, 3).map((link, idx) => (
                  <React.Fragment key={idx}>
                    <a
                      href={link.url || "#"}
                      className="hover:underline whitespace-nowrap"
                      target={isExternal(link.url) ? "_blank" : undefined}
                      rel={
                        isExternal(link.url) ? "noopener noreferrer" : undefined
                      }
                    >
                      {link.label}
                    </a>
                    {idx < 2 && <span className="opacity-60">|</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* line 2 */}
              <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
                {links.slice(3, 6).map((link, idx) => (
                  <React.Fragment key={idx + 3}>
                    <a
                      href={link.url || "#"}
                      className="hover:underline whitespace-nowrap"
                      target={isExternal(link.url) ? "_blank" : undefined}
                      rel={
                        isExternal(link.url) ? "noopener noreferrer" : undefined
                      }
                    >
                      {link.label}
                    </a>
                    {idx < 2 && <span className="opacity-60">|</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* line 3 */}
              <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
                {links.slice(6, 8).map((link, idx) => (
                  <React.Fragment key={idx + 6}>
                    <a
                      href={link.url || "#"}
                      className="hover:underline whitespace-nowrap"
                      target={isExternal(link.url) ? "_blank" : undefined}
                      rel={
                        isExternal(link.url) ? "noopener noreferrer" : undefined
                      }
                    >
                      {link.label}
                    </a>
                    {idx < 1 && <span className="opacity-60">|</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* ICONS ROW */}
            {/* ICONS (2 hàng, mỗi hàng 6 icon) */}
            <div className="mt-4 grid grid-cols-6 gap-y-2 place-items-center">
              {/* 9 trust icons */}
              {Array.from({ length: 9 }).map((_, i) => (
                <Image
                  key={i}
                  src={`/footer/icon/${i + 1}.png`}
                  width={120}
                  height={120}
                  alt={`trust-${i + 1}`}
                  className="h-[40px] w-auto opacity-80 grayscale"
                />
              ))}

              {/* Social icons */}
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[35px] h-[35px]  flex items-center justify-center hover:bg-white/15 transition"
              >
                <Image
                  src="/footer/icon/fb.png"
                  width={60}
                  height={60}
                  alt="facebook"
                  className=" w-auto "
                />
              </a>

              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[35px] h-[35px]  flex items-center justify-center hover:bg-white/15 transition"
              >
                <Image
                  src="/footer/icon/youtube.png"
                  width={60}
                  height={60}
                  alt="youtube"
                  className=" w-auto "
                />
              </a>

              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[35px] h-[35px]  flex items-center justify-center hover:bg-white/15 transition"
              >
                <Image
                  src="/footer/icon/telegram.png"
                  width={60}
                  height={60}
                  alt="telegram"
                  className=" w-auto "
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
