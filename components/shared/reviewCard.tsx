import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
type review = {
  id: number;
  rate: number;
  text: string;
  user_image: string;
  user_name: string;
  user_desc: string;
};

type Props = {
  review: review;
};

export default function ProductCard({ review }: Props) {
  const stars = [];
  for (let i = 1; i < 6; i += 1) {
    if (i <= review.rate) {
      stars.push(
        <FontAwesomeIcon
          key={`star-${review.id}-${i}`}
          icon={faStar}
          className="text-[#F2C94C]"
        />
      );
    } else {
      stars.push(
        <FontAwesomeIcon
          key={`star-${review.id}-${i}`}
          icon={faStar}
          className="text-[#D6D6D6]"
        />
      );
    }
  }

  return (
    <div className="h-auto w-full max-w-sm sm:max-w-md border border-[#EEEEEE] rounded-md p-6 flex flex-col justify-between">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-1">{stars}</div>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_292_354)">
            <path
              d="M0.00680363 22.2053C0.00680363 26.4124 3.41715 29.8228 7.62422 29.8228C11.8314 29.8228 15.2417 26.4124 15.2417 22.2053C15.2417 17.9982 11.8314 14.5879 7.62422 14.5879C6.7596 14.5879 5.93196 14.7386 5.15716 15.0042C6.87141 5.17257 14.5382 -1.16773 7.4311 4.05046C-0.449598 9.83686 -0.00163658 21.9725 0.00718155 22.1949C0.00718155 22.1984 0.00680363 22.2015 0.00680363 22.2053Z"
              fill="#EEEEEE"
            />
            <path
              d="M16.7651 22.2053C16.7651 26.4124 20.1754 29.8228 24.3826 29.8228C28.5897 29.8228 32.0001 26.4124 32.0001 22.2053C32.0001 17.9982 28.5896 14.5879 24.3825 14.5879C23.5178 14.5879 22.6902 14.7386 21.9154 15.0042C23.6297 5.17257 31.2965 -1.16773 24.1894 4.05046C16.3087 9.83686 16.7566 21.9725 16.7655 22.1949C16.7655 22.1984 16.7651 22.2015 16.7651 22.2053Z"
              fill="#EEEEEE"
            />
          </g>
          <defs>
            <clipPath id="clip0_292_354">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <p className="text-[#666666]">{review.text}</p>

      <div className="flex flex-row items-center justify-start gap-3">
        <Image
          src={review.user_image}
          alt={review.user_image}
          width={100}
          height={100}
          className="h-12.5 w-12.5 rounded-full"
        />
        <div className="flex flex-col items-start justify-center">
          <p className="text-[#333333] font-bold">{review.user_name}</p>
          <p className="text-[#666666]">{review.user_desc}</p>
        </div>
      </div>
    </div>
  );
}
