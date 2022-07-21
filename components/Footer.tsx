import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";

const path = [
  { uid: 21, name: " Home", id: 1, path: "/" },
  { uid: 31, name: "Blog", id: 2, path: "Blog" },
  { uid: 41, name: "About", id: 3, path: "About" },
  {
    uid: 45,
    name: "Copy Right ©️ 2022",
    id: 4,
    path: "https://daffnft.herokuapp.com/"
  }
];
export default function Footer() {
  return (
    <footer>
      <nav>
        <ul>
          {path.map((value) => {
            return (
              <li key={value.uid}>
                <Link href={value.path}>
                  <a> {value.name} </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
