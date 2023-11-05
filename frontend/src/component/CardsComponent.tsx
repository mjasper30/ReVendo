import { Card } from "flowbite-react";

interface CardProps {
  bgColor: string;
  icon: string;
  title: string;
  value: string | number;
}

const CardsComponent = ({ bgColor, icon, title, value }: CardProps) => {
  return (
    <Card className={`max-w-sm ${bgColor}`} horizontal>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <span className="material-symbols-rounded text-[#2B2D31] p-2">
          {icon}
        </span>
        {title}
      </h5>
      <p className="text-center font-normal text-xl text-gray-700 dark:text-gray-400">
        {value}
      </p>
    </Card>
  );
};

export default CardsComponent;
