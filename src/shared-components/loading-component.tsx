import React from "react";
interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  isLoading: boolean;
}
const LoadingComponent = ({ isLoading, children }: Props) => {
  return <div>{(!!isLoading && <p>Loading...</p>) || children}</div>;
};

export default LoadingComponent;
