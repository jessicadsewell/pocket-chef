import React from "react";
import { Head } from "@inertiajs/react";
import NavBar from "./NavBar/NavBar";

interface Props {
  title: string;
  children: React.ReactNode;
}

const AppLayout = ({ title, children }: Props) => {
  return (
    <>
      <Head title={title} />
      <NavBar />
      <main className="p-4">{children}</main>
    </>
  );
};

export default AppLayout;
