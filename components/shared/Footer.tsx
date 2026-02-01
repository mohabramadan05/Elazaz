import Image from "next/image";
import NewsLetter from "./news";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSnapchatGhost,
  faInstagram,
  faTwitter,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export default function Header() {
  return (
    <footer className="mt-12">
      <NewsLetter />

      <div className="bg-white py-16 px-6 xl:px-28 text-[#333]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-10">
          {/* About */}
          <div className="xl:col-span-1">
            <h3 className="font-semibold text-lg mb-4">عن متجرنا</h3>
            <p className="text-sm leading-relaxed text-[#666]">
              عزاز هو متجر رائد متخصص في بيع الحقائب والأحذية الفاخرة. اكتشف
              أحدث التشكيلات واستمتع بتجربة تسوق فريدة مع عروض حصرية وخصومات لا
              تقبل المنافسة.
            </p>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-lg mb-4">حسابي</h3>
            <ul className="flex flex-col gap-3 text-sm text-[#666]">
              <Link href="/profile">
                <li className="hover:text-[#C58A3A]">» حسابي</li>
              </Link>
              <Link href="/profile/orders">
                <li className="hover:text-[#C58A3A]">» طلباتي</li>
              </Link>
              <Link href="/profile/cart">
                <li className="hover:text-[#C58A3A]">» سلة المشتريات</li>
              </Link>
              <Link href="/profile/wishlist">
                <li className="hover:text-[#C58A3A]">» المفضلة</li>
              </Link>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">روابط مهمة</h3>
            <ul className="flex flex-col gap-3 text-sm text-[#666]">
              <Link href="/contact-us">
                <li className="hover:text-[#C58A3A]">» من نحن</li>
              </Link>
              <Link href="/policies/privacy-policy">
                <li className="hover:text-[#C58A3A]">» سياسة الخصوصية</li>
              </Link>
              <Link href="/policies/terms-and-conditions">
                <li className="hover:text-[#C58A3A]">» الشروط والأحكام</li>
              </Link>
              <Link href="/policies/technical-support">
                <li className="hover:text-[#C58A3A]">» الدعم الفني</li>
              </Link>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">تواصل معنا</h3>
            <ul className="flex flex-col gap-3 text-sm text-[#666]">
              <Link href="/">
                <li className="hover:text-[#C58A3A]">
                  » واتساب : <span dir="ltr">+966558441497</span>
                </li>
              </Link>
              <Link href="/">
                <li className="hover:text-[#C58A3A]">
                  » موبايل : <span dir="ltr">+966558441497</span>
                </li>
              </Link>
              <Link href="/">
                <li className="hover:text-[#C58A3A]">
                  » البريد : https://elazaz.site
                </li>
              </Link>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">تابعنا على</h3>
            <div className="flex gap-3 flex-wrap">
              <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#EEE] text-[#999] hover:text-[#C58A3A] hover:border-[#C58A3A] transition">
                <FontAwesomeIcon icon={faSnapchatGhost} />
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#EEE] text-[#999] hover:text-[#C58A3A] hover:border-[#C58A3A] transition">
                <FontAwesomeIcon icon={faInstagram} />
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#EEE] text-[#999] hover:text-[#C58A3A] hover:border-[#C58A3A] transition">
                <FontAwesomeIcon icon={faTwitter} />
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#EEE] text-[#999] hover:text-[#C58A3A] hover:border-[#C58A3A] transition">
                <FontAwesomeIcon icon={faFacebookF} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-white bg-[#1D1F1F] text-sm p-4">
        <span className="text-center lg:text-right">
          &copy; {new Date().getFullYear()} ELAZAZ. جميع الحقوق محفوظة.
        </span>
        <div className="flex flex-row flex-wrap justify-center lg:justify-end gap-2 items-center">
          <Image
            src="/assets/vat.jpg"
            width={22.5}
            height={30}
            alt="vat"
            className="h-6 w-auto"
          />
          <p className="pe-0 lg:pe-5">123124123123 : الرقم الضريبي</p>
          <Image
            src="/assets/visa.png"
            width={64}
            height={31}
            alt="visa"
            className="h-6 w-auto"
          />
          <Image
            src="/assets/mastercard.png"
            width={60}
            height={31}
            alt="mastercard"
            className="h-6 w-auto"
          />
          <Image
            src="/assets/paypal.png"
            width={60}
            height={31}
            alt="paypal"
            className="h-6 w-auto"
          />
        </div>
      </div>
    </footer>
  );
}
