import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container(props: Readonly<ContainerProps>) {
  return (
    <div
      className={`mx-auto xl:px-0 ${
        props.className ? props.className : ""
      }`}>
      <div className="container">
        {props.children}
      </div>
    </div>
  );
}

