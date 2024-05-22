import React, { useState, useRef, useEffect } from "react";
import "./Input.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  setFile?: React.Dispatch<React.SetStateAction<File | null>>;
  nameInput?: string;
  typeHandler?: string;
  type: string;
  password?: string;
}

function Input({
  setFile,
  nameInput,
  typeHandler,
  type,
  password,
  ...rest
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [nameFile, setNameFile] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && setFile) {
      setNameFile(e.target.files[0]?.name);
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (inputRef.current && password && password !== null) {
      inputRef.current.setAttribute("value", password as string);
    }
    //eslint-disable-next-line
  }, [password]);

  return (
    <>
      {type === "file" && (
        <section id="encrypt" className="flex flex-col gap-x-5 ">
          <input id={nameInput ? nameInput : ''} type={type} onChange={handleFileChange} />
          <label
            id="fileLabel"
            htmlFor={nameInput ? nameInput : ''}
            className="flex flex-row align-items-center gap-3 uppercase text-lg tracking-wide text-white bg-red-700	py-8 px-8 rounded-md select-none cursor-pointer shadow-2xl"
          >
            <i>
              <FontAwesomeIcon icon={faUpload} />
            </i>
            <p>Choose a file {typeHandler}...</p>
          </label>
          {nameFile && (
            <p className="name-file text-base text-white italic text-center mt-1.5">
              name of file: {nameFile}
            </p>
          )}
        </section>
      )}

      {type === "text" && <input ref={inputRef} type={type} {...rest} />}
    </>
  );
}

export default Input;
