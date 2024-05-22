import React from "react";

interface OptionsType {
    label: string;
    value: string;
}

interface SelectType extends React.SelectHTMLAttributes<HTMLSelectElement> {
    nameSelect: string;
}

export default function Select({nameSelect, ...rest}: SelectType) {
  const Options: OptionsType[] = [
    { label: "docx", value: "docx" },
    { label: "pptx", value: "pptx" },
    { label: "xlsx", value: "xlsx" },
    { label: "pdf", value: "pdf" },
    { label: "txt", value: "txt" },
    { label: "jpg", value: "jpg" },
    { label: "jpeg", value: "jpeg" },
    { label: "png", value: "png" },
  ];

  return (
    <>
      <select className="outline-none py-2 px-1 rounded-md cursor-pointer" {...rest}>
        {Options.map((option) => {
           return <option key={option.label} value={option.value} >
                {option.label}
           </option>
        })}
      </select>
    </>
  );
}
