"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

// Hook para detectar scroll e controlar visibilidade da dock
const useScrollVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercentage =
        (currentScrollY / (documentHeight - windowHeight)) * 100;

      // Esconde quando chegar no fim da página (últimos 5%)
      if (scrollPercentage >= 95) {
        setIsVisible(false);
      }
      // Mostra quando scrollar para cima
      else if (currentScrollY < lastScrollYRef.current) {
        setIsVisible(true);
      }
      // Esconde quando scrollar para baixo (com threshold para evitar flickering)
      else if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setIsVisible(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isVisible;
};

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
  }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  const isVisible = useScrollVisibility();

  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        isVisible={isVisible}
      />
      <FloatingDockMobile
        items={items}
        className={mobileClassName}
        isVisible={isVisible}
      />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  isVisible,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
  }[];
  className?: string;
  isVisible: boolean;
}) => {
  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className={cn(
        "flex md:hidden gap-2 justify-center items-center bg-gray-50 dark:bg-neutral-900 px-4 py-2 rounded-2xl shadow-lg",
        className
      )}
    >
      {items.map((item) => {
        if (item.onClick) {
          return (
            <button
              key={item.title}
              onClick={item.onClick}
              className="h-12 w-12 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors"
              title={item.title}
            >
              <div className="h-5 w-5">{item.icon}</div>
            </button>
          );
        }
        return (
          <Link
            href={item.href!}
            key={item.title}
            className="h-12 w-12 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors"
            title={item.title}
          >
            <div className="h-5 w-5">{item.icon}</div>
          </Link>
        );
      })}
    </motion.div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  isVisible,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
  }[];
  className?: string;
  isVisible: boolean;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden md:flex h-16 gap-4 items-end  rounded-2xl bg-gray-50 dark:bg-neutral-900 px-4 pb-3",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20]
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const containerElement = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center relative"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center"
      >
        {icon}
      </motion.div>
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`cursor-pointer ${title === "Sair" ? "no-glow" : ""}`}
      >
        {containerElement}
      </button>
    );
  }

  return <Link href={href!}>{containerElement}</Link>;
}
