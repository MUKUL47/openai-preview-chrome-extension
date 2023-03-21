import { useState } from "react";
import "./Options.css";

function App() {
  const [count, setCount] = useState(0);

  return <Options />;
}
function Options() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 items-start">
        <p className="items-center w-full text-6xl mb-10">Options</p>
        <div className="flex gap-2 w-5/12 items-center">
          <label htmlFor="">API Key</label>
          <input
            type="password"
            className="flex-1 p-2 rounded-md"
            placeholder="Enter your OpenAI api key"
          />
          <button>Save</button>
        </div>
      </div>
      <Tabs
        tabs={[
          {
            child: <CreateOptions />,
            name: "Create Config",
          },
          {
            child: <SaveConfigs />,
            name: "Configs",
          },
        ]}
      />
      <footer>
        Made by <a href="#">Mukul</a>
      </footer>
    </div>
  );
}
function SaveConfigs() {
  return (
    <div>
      <div
        style={{ maxHeight: "calc(100vh - 300px)" }}
        className="config-data flex flex-col gap-2 overflow-auto"
      >
        {Array(20)
          .fill(1)
          .map((v) => {
            return (
              <div className="flex gap-3 justify-between items-center border rounded-md p-4 border-opacity-5">
                <div>
                  <label className="text-xl">Config Name</label>
                </div>
                <div className="flex gap-2 text-sm">
                  <button className="flex justify-center">Make default</button>
                  <button className="flex justify-center bg-red-700">
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
function CreateOptions() {
  const Input = ({ label, placeholder, name, required, type }: any) => {
    return (
      <div className="flex gap-2 flex-col">
        <label className="flex-1 text-left">{label}</label>
        <input
          type={type || "text"}
          className="flex-1 p-1 rounded-sm pl-2"
          required={!!required}
          name={name}
          placeholder={placeholder}
        />
      </div>
    );
  };
  return (
    <div>
      <form action="" className="flex flex-col">
        <div className="flex flex-col gap-2">
          <Input
            label="Name"
            placeholder="Enter Name"
            name="name"
            required={true}
          />
          <div className="flex gap-2 flex-col">
            <label className="flex-1 text-left">Enter Config</label>
            {/* <input
              type={type || "text"}
              className="flex-1 p-1 rounded-sm pl-2"
              required={!!required}
              name={name}
              placeholder={placeholder}
            /> */}
          </div>
        </div>
        <div className="flex gap-2">
          <button>Create</button>
          <button>Reset</button>
        </div>
      </form>
    </div>
  );
}
interface TabProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  activeTab?: string;
  tabs: {
    name: string;
    child: React.ReactNode;
  }[];
}
function Tabs({ children, activeTab, tabs = [] }: TabProps) {
  //[]
  const active = "bg-cyan-700 text-white text-xl";
  const defaultClass = "p-1 px-2 bg-blue-200 rounded-sm cursor-pointer";
  const [currentActiveTab, setCurrentActiveTab] = useState(
    activeTab || tabs[0]?.name
  );
  return (
    <div className="flex gap-2 flex-col">
      <div className="flex flex-wrap gap-2 top-0 sticky">
        {tabs.map((tab) => {
          return (
            <div
              className={`${defaultClass}  hover:bg-cyan-700 hover:text-white text-xl rounded-md text-center p-4 bg-opacity-25 flex-1  ${
                tab.name === currentActiveTab && active
              }`}
              onClick={() => {
                setCurrentActiveTab(tab.name);
              }}
            >
              {tab.name}
            </div>
          );
        })}
      </div>
      {
        tabs.find(({ child, name }) => {
          return name === currentActiveTab;
        })?.child
      }
    </div>
  );
}
export default App;
