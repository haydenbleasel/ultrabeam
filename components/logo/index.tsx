import Image from "next/image";
import logo from './logo.svg';

export const Logo = () => {
  return (
    <Image
      src={logo}
      alt="Logo"
      width={32}
      height={32}
      className="size-4"
    />
  );
};
