import React, { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import growingImg from "../../assets/img/growing-mode.png";
import linkingImg from "../../assets/img/linking-mode.png";
import axios from "axios";
import api from "../../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto space-y-8">
      <div className="flex justify-around">
        <div
          className="w-1/4 cursor-pointer"
          onClick={() =>
            navigate({
              pathname: "/growing",
              search: `?${createSearchParams({ tab: 1 })}`,
            })
          }
        >
          <img src={growingImg} />
        </div>
        <div
          className="w-1/4 cursor-pointer"
          onClick={() =>
            navigate({
              pathname: "/linking",
              search: `?${createSearchParams({ first_tab: 1, second_tab: 1 })}`,
            })
          }
        >
          <img src={linkingImg} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
