import { Menu } from "@/types/menu";

// ! FIX ME

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Features",
    newTab: false,
    path: "/#features",
  },
  {
    id: 3,
    title: "Testimonials",
    newTab: false,
    path: "/#testimonials",
  },
  {
    id: 4,
    title: "FAQ",
    newTab: false,
    path: "/#faq",
  },
  {
    id: 5,
    title: "Pages",
    newTab: false,
    submenu: [
      {
        id: 51,
        title: "Sign In",
        newTab: false,
        // path: "/auth/signin",
      },
      {
        id: 52,
        title: "Sign Up",
        newTab: false,
        // path: "/auth/signup",
      },
      {
        id: 53,
        title: "404",
        newTab: false,
        path: "/404",
      },
    ],
  },
];

export default menuData;
