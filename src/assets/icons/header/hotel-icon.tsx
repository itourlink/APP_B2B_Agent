import { memo } from "react";

interface Props {
  currentColor?: string;
  width?: string;
  height?: string;
}

const HotelIcon = ({
  width = "24px",
  height = "24px",
}: Props) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      enableBackground="new 0 0 512 512"
      width={width}
      height={height}
    >
      <path
        fill="currentColor"
        d="m448.1,11h-384c-11.3,0-20.5,9.1-20.5,20.4v449.2c0,11.3 9.2,20.4 20.5,20.4h384c11.3,0 20.5-9.1 20.5-20.4v-449.2c0-11.3-9.2-20.4-20.5-20.4zm-20.5,115.7h-81.9v-74.9h81.9v74.9zm-343.1,120.8v-80h81.9v80h-81.9zm122.9-80h97.3v80h-97.3v-80zm0-40.8v-74.9h97.3v74.9h-97.3zm138.3,40.8h81.9v80h-81.9v-80zm-179.2-115.7v74.9h-82v-74.9h82zm123.7,408.4h-68.3v-56.2c0-18.8 15.3-34 34.1-34 18.8,0 34.1,15.3 34.1,34v56.2zm41.1,0v-56.2c0-41.3-33.7-74.9-75.1-74.9-41.4,0-75.1,33.6-75.1,74.9v56.1h-96.5v-171.8h343.1v171.8h-96.4z"
      />
    </svg>
  );
};

export default memo(HotelIcon);