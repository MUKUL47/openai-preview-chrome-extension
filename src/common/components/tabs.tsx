import React, { useState } from "react";
interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    activeTab ?: string;
    tabs : {
        name : string;
        child : React.ReactNode
    }[]
}
export default 
function Tabs({ children, activeTab, tabs = [] } : Props) {
  //[]
  const active = "bg-cyan-700 text-white text-ml";
  const defaultClass = "p-1 px-2 bg-blue-200 rounded-sm cursor-pointer";
  const [currentActiveTab, setCurrentActiveTab] = useState(
    activeTab || tabs[0]?.name
  );
  return (
    <div className="flex gap-2 flex-col m-5 h-screen">
      <div className="flex flex-wrap gap-2 top-0 sticky">
        {tabs.map((tab) => {
          return (
            <div
              className={`${defaultClass}  hover:bg-cyan-700 hover:text-white text-center rounded-lg p-4 bg-opacity-25 flex-1 text-3xl  ${
                tab.name === currentActiveTab && active
              }`}
              onClick={() => {
                setCurrentActiveTab(tab.name);
              }}>
              {tab.name}
            </div>
          );
        })}
      </div>
      {
        tabs
          .filter(({ child, name }) => {
            return name === currentActiveTab;
          })
          .map((v) => v.child)[0]
      }
    </div>
  );
}