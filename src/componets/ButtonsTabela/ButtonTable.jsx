import { Fragment } from "react"
import { MdOutlineLocalPrintshop, MdOutlineAttachMoney,MdClose, MdPix, MdMoneyOff, MdFormatListBulleted, MdOutlineCreateNewFolder } from "react-icons/md";
import { CiEdit, CiPower } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import { GrFormView } from "react-icons/gr";
import { BsCash } from "react-icons/bs";
import { GiClothes, GiTakeMyMoney } from "react-icons/gi";
import { FaBalanceScale, FaBalanceScaleLeft, FaUnlink} from "react-icons/fa";
import { FaScaleUnbalanced, FaCcMastercard } from "react-icons/fa6";
import { FcCurrencyExchange } from "react-icons/fc";
import { FaRegTrashAlt,FaRegSave } from "react-icons/fa"
import { FiSend } from "react-icons/fi";
import { GrCertificate } from "react-icons/gr";
import { FaCashRegister, FaUserAltSlash, FaUserTimes,FaExclamation } from "react-icons/fa";
import { AiOutlineDelete, AiOutlineCloseCircle, AiOutlineArrowLeft } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";
import { FaProductHunt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { GoDownload } from "react-icons/go";
import { GrDocumentPdf } from "react-icons/gr";
import { BsTrash3 } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import { MdOutlineSend } from "react-icons/md";
import { SiSap } from "react-icons/si";
import { FaRegBuilding } from "react-icons/fa";
import { FcProcess } from "react-icons/fc";
import { GrDocumentDownload } from "react-icons/gr"
import { FaTruckFast } from "react-icons/fa6";
import { SiMicrosoftexcel } from "react-icons/si";
import { BsFiletypePdf } from "react-icons/bs";

export const ButtonTable = ({
  onClickButton, 
  titleButton,
  textButton,
  className,
  cor,
  tipo,
  Icon,
  iconColor,
  iconSize,
  disabledBTN,
  width = 'auto',
  height = 'auto',
  id,
  size = 'sm',
  textFontSize = '12px' 
}) => {
  let btnClasses = "btn  btn-icon";

  if(cor === "primary") {
    btnClasses += " btn-primary";
  } else if(cor === "secondary") {
    btnClasses += " btn-secondary";
  } else if (cor === "success") {
    btnClasses += " btn-success";
  } else if (cor === "danger") {
    btnClasses += " btn-danger";
  } else if (cor === "warning") {
    btnClasses += " btn-warning";
  } else if (cor === "info") {
    btnClasses += " btn-info";
  } else if (cor === "dark") {
    btnClasses += " btn-dark";
  }

  if (size === "sm") {
    btnClasses += " btn-sm";
  } else if (size === "md") {
    btnClasses += " btn-md";
  } else if (size === "lg") {
    btnClasses += " btn-lg";
  }

  const typeButton = tipo === "button" ? "button" : "submit";

  return (
    <Fragment>
      <button
        disabled={disabledBTN}
        type="button"
        className={`${btnClasses} ${className}`}
        style={{ alignItems: "center", fontSize: "22px", width, height }}
        onClick={onClickButton}
        title={titleButton}
        id={id}
      >
        {Icon && <Icon size={iconSize} color={iconColor} />}
        {/* {textButton} */}
        <span style={{ fontSize: textFontSize }}>{textButton}</span>
      </button>
    </Fragment>
  )
}

