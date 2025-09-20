import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const {isDarkMode} = useTheme()
  const { pathname } = useLocation();
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <div className={ ` ${isDarkMode ? 'text-white' : 'text-black'} ${pathnames.length > 0 ? 'mt-20 p-2' : 0}`}>
    {pathnames.length > 0 &&   <Link to="/">Home</Link>}

      {pathnames.map((name, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <span key={routeTo}> › {name}</span>
        ) : (
          <span key={routeTo}>
            {" › "}
            <Link to={routeTo}>{name}</Link>
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
