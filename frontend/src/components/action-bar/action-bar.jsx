import { Shapes } from "../../types";

import { LuPencil } from "react-icons/lu";
import { FiCircle, FiMinus, FiMousePointer, FiSquare } from "react-icons/fi";
import { FaImage } from "react-icons/fa"
import { MdImage } from 'react-icons/md';
import { IoMdImage } from 'react-icons/io';
import { IoHandRightOutline, IoText } from "react-icons/io5";
import "./action-bar-style.css";
import ArrowLine from "./arrow-line";

function ActionBar({ shape, setShape }) {
  return (
    <div className="actionBar">
      {Object.values(Shapes).map((t, index) => (
        <div
          className={`inputWrapper ${shape === t ? "selected" : ""}`}
          key={t}
          onClick={() => setShape(t)}
        >
          <input
            type="radio"
            id={t}
            checked={shape === t}
            onChange={() => setShape(t)}
            readOnly
          />
          <label htmlFor={t}>{t}</label>
          {t === "pan" && <IoHandRightOutline />}
          {t === "select" && <FiMousePointer />}
          {t === "rec" && <FiSquare />}
          {t === "ellipse" && <FiCircle />}
          {/* {t === "line" && <FiMinus />} */}
          {t === "line" && <ArrowLine />}
          {t === "hand" && <LuPencil />}
          {t === "text" && <IoText />}
          {t === "image" && <MdImage />}
          <span>{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

export default ActionBar
