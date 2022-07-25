import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";

const path = [
  { uid: 21, name: " Home", id: 1, path: "/" },
  { uid: 31, name: "Mint NFT", id: 2, path: "mint" },
  { uid: 41, name: "Stake NFT", id: 3, path: "stake" },
  {
    uid: 45,
    name: "Copy Right ©️ 2022",
    id: 4,
    path: "https://daffnft.herokuapp.com/"
  }
];
export default function Footer() {
  return (
    <footer className="container-fluid d-flex bg-light">
      <nav className="container">
        <ul className="d-flex justify-content-space-between gap-10">
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
